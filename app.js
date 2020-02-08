'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------
var balance = 0;
var GPA = 4.0;
var happiness = 7;
var year = 1;
var eventID = [];
const calculateBalance = function(){


}
app.setHandler({
    LAUNCH() {
        console.log("launched");
        let background = 'You’re a senior in high school, trying to decide what to do for next year. You live in a middle-class family, with a household income of 65,000 dollars. You’ve been accepted to a good state school, and your tuition is 20,000 dollars a year. Your parents can’t contribute to this tuition. You have the option to either get a bachelor’s degree, or to get a job in the workforce. If you get a job, you’ll make 30,000 dollars a year. Will you go to college or get a job?';
        let repeat = 'Will you go to college or get a job?';
        this.ask(background,repeat);
    },
    CollegeIntent(){
        console.log("went to college");
        let college = 'Now that you’ve decided to pursue higher education, you need to take out a federal loan of 20,000 dollars, which has a fixed interest rate of 5% a year. You could also participate in a work-study program and earn up to 2,500 dollars a year. Would you like to do work-study?';
        let repeat = 'Would you like to do work-study?';
        console.log("before this.ask");
        this.followUpState('WorkStudyState').ask(college,repeat);
        console.log("after this.ask");
      //  this.toIntent('RandomEventIntent');
    },
    WorkStudyState: {
        YesIntent(){
            console.log("yes");
            this.toIntent('RandomEventIntent');
        },
        NoIntent(){
            console.log("no");
            this.toIntent('RandomEventIntent');
        },
    },
    RandomEventIntent(){
        var id = Math.floor((Math.random()*4)+1);
        while (eventID.indexOf(id)<0){
            id = Math.floor((Math.random()*4)+1);
        }
        elementID.push(id);
        if (id==1){
            this.toIntent('PartyIntent');
        }
        else if (id==2){
            this.toIntent('ConcertIntent');
        }
        else if (id==3){
            this.toIntent('BorrowIntent');
        }
        else {
            this.toIntent('WalletIntent');
        }
    },
    PartyIntent(){
        console.log("party intent");
    },
    ConcertIntent(){
        console.log("console intent");
    },
    BorrowIntent(){
        console.log("borrow intent");
    },
    WalletIntent(){
        console.log("wallet intent");
    },



    GapYearIntent(){
        
    },
    BalanceIntent(){

    },
    HappinessIntent(){

    },
    GPAIntent(){

    },
    SituationIntent(){

    },
    LoseIntent(){

    },
});

module.exports.app = app;
