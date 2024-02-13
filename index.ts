import inquirer from 'inquirer';

class User {
    constructor(public userId: string, public pin: number, public balance: number) {
    }

    withdraw(amount: number): boolean {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}

const users: User[] = [
    new User('User_1', 1234, Math.floor(100 + Math.random() * 10000)),
    new User('User_2', 5678, Math.floor(100 + Math.random() * 10000)),
    new User('User_3', 9012, Math.floor(100 + Math.random() * 10000))
];

function authenticateUser(): Promise<User> {
    return new Promise((resolve) => {
        function userPrompt() {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'userId',
                    message: 'Enter your user id:'
                },
                {
                    type: 'password',
                    name: 'pin',
                    message: 'Enter your pin:'
                }
            ]).then((answers: { userId: string; pin: string }) => {
                const user = users.find(u => u.userId === answers.userId && u.pin === parseInt(answers.pin));
                if (user) {
                    resolve(user);
                } else {
                    console.log('Invalid user id or pin - Try again');
                    userPrompt();
                }
            });
        }

        userPrompt();
    });
}

async function runATM(): Promise<void> {
    try {
        const user: User = await authenticateUser();
        console.log(`Welcome, ${user.userId}!`);
        console.log(`Your current balance is Rs.${user.balance}`);

        while (true) {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: ['View balance', 'Withdraw money', 'Exit']
                }
            ]);

            if (answer.action === 'View balance') {
                console.log(`Your current balance is Rs.${user.balance}`);
            } else if (answer.action === 'Withdraw money') {
                const withdrawAmount: any = await inquirer.prompt({
                    type: 'input',
                    name: 'amount',
                    message: 'Enter amount to withdraw:'
                });

                const amount: number = parseFloat(withdrawAmount.amount);
                if (isNaN(amount) || amount <= 0) {
                    console.log('Invalid amount - Try again');
                } else {
                    const success: boolean = user.withdraw(amount);
                    if (success) {
                        console.log(`Withdrawn Rs.${amount} - Your current balance is Rs.${user.balance}`);
                    } else {
                        console.log('Insufficient funds');
                    }
                }
            } else {
                console.log('Exiting...');
                break;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

runATM();
