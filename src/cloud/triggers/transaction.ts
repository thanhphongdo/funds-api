import { CloudTriggerBase } from '../../parse/index';
import { User } from '../../model'

export class TransactionTrigger extends CloudTriggerBase {
    constructor() {
        super();
        // this.defineTriggerBeforeSave('Transaction', this.beforeSaveTransaction);
    }

    // async beforeSaveTransaction(request: Parse.Cloud.BeforeSaveRequest<Parse.Object<Parse.Attributes>>) {
    //     const transaction = request.object;
    //     const amount = transaction.get('amount');
    //     if (!request.original) {
    //         //is created
    //         const [sender, receiver] = await Promise.all([
    //             new User(transaction.get('sender').toJSON()).fetch({ useMasterKey: true }),
    //             new User(transaction.get('receiver').toJSON()).fetch({ useMasterKey: true })
    //         ]);
    //         sender.balance -= amount;
    //         receiver.balance += amount;
    //         console.log('==============');
    //         console.log(sender.balance + ' --- ' + amount);
    //         console.log(receiver.balance + ' --- ' + amount);
    //         await Promise.all([
    //             sender.save(null, { useMasterKey: true }),
    //             receiver.save(null, { useMasterKey: true })
    //         ]);
    //     } else {
    //         // is updated
    //     }
    // }
}