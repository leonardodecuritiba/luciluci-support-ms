// Proof-only preload. It pauses the callback after RF12's count query while
// PostgreSQL keeps its REPEATABLE READ transaction open. Never loaded by the app normally.
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const directory = process.env.RF12_PROOF_GATE_DIR;
if (directory) {
	const original = Client.prototype.query;
	Client.prototype.query = function gatedQuery(...args) {
		const sql = typeof args[0] === 'string' ? args[0] : args[0]?.text;
		const arm = path.join(directory, 'arm');
		if (sql && /\bFROM\s+"?ticket_message_media"?/i.test(sql)) {
			fs.appendFileSync(path.join(directory, 'media-queries'), '1\n');
		}
		if (sql && /ticket_messages/i.test(sql)) {
			fs.appendFileSync(
				path.join(directory, 'message-queries'),
				`${sql.replaceAll(/\s+/g, ' ')}\n`,
			);
		}
		if (
			!sql ||
			!/COUNT\s*\(/i.test(sql) ||
			!/ticket_messages/i.test(sql) ||
			!fs.existsSync(arm)
		) {
			return original.apply(this, args);
		}
		fs.unlinkSync(arm);
		const resume = () =>
			new Promise((resolve) => {
				fs.writeFileSync(path.join(directory, 'paused'), 'count-complete');
				const marker = path.join(directory, 'resume');
				const timer = setInterval(() => {
					if (!fs.existsSync(marker)) return;
					clearInterval(timer);
					fs.unlinkSync(marker);
					resolve();
				}, 10);
			});
		const callbackIndex = args.findIndex((arg) => typeof arg === 'function');
		if (callbackIndex < 0) {
			return Promise.resolve(original.apply(this, args)).then(async (result) => {
				await resume();
				return result;
			});
		}
		const callback = args[callbackIndex];
		args[callbackIndex] = (...results) => {
			resume().then(() => callback(...results));
		};
		return original.apply(this, args);
	};
}
