import Ticket from '../../entities/ticket.entity';

export default interface IGetTicketRepository {
	findById(id: string): Promise<Ticket | undefined>;
	hasDepartmentMembership(departmentId: string, userId: string): Promise<boolean>;
}
