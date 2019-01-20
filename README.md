# SeminarSAN
Seminar TUE Blockchain - Lunchbox application


Joep Wijnhoven - 1030194
Niels Rood - 0848305


Running the application:
The contract is deployed on Ropsten with contractadres: '0x1ccf681510d7597eef1b1ab347a37456c1c5addb'. You can also visit etherscan to see the sourcecode of the smartcontract with transactions and events that have happened online: https://ropsten.etherscan.io/address/0x1ccf681510d7597eef1b1ab347a37456c1c5addb
To run this application go to the frontend folder en run the command "node server.js" in cmd. If you want to run the application with local contract (ganache) then you should change the contractaddress in contract_template.js.


What did we change/implement:
Most implemention/changes of the frontend can be found in the contract_template.js and the .tag files. The implemention of the backend can be found in the folder "smartcontracts". In particular, "smartcontract/contracts/MealMenu.sol" is our smart contract for this application.


What can the application do:
In our implemention cooks can provide a meal. Eaters can reserve a spot for this meal and when they do they get a reservation code. This reservation code is saved locally on localstorage. The eater can exchange this code for food with the cook. The cook enters this code to receive his/her payment.
The cook can enter this code on the page where he/she can edit the meal. He/she has to enter the reservation code for every eater separately. This could be improved by letting the cook just enter a reservation code and letting the backend check if there is an eater with that reservation code. To achieve this we would have to change the datastructure in the contract that saves the hash of the reservation codes. Therefore, we choose to not make these alterations to our current stable application.
We also make use of events (see smartcontract). This will automatically update the data on the webpage without refreshing the page.


Testing:
We also wrote some test to get some feeling how a smartcontract can be tested. These tests are located in /smartcontracts/test. You can run those tests by locating to the "smartcontracts/test" folder and running the command "truffle test".
