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
var debt = 0;
var GPA = 4.0;
var happiness = 7;
var year = 0;
var grade = 0;
var eventID = [];
var gap = false;
var ws = false;
var salary = 0;
var scenario = "";
var scenariows = "";
var major = "";
const updateStats = function(){
    console.log("update stats");
    var change = Math.random();
    var happinessChange = "";
    var hChange = 0;
    if (ws)
    {
        console.log("change ws");
        change = change - 0.7;
    }
    else{
        change = change - 0.5;
    }
    console.log("before df");
    change*=100;
    change=Math.floor(change);
    change/=100;
    console.log(change+"");
    if (GPA + change > 4){
        GPA = 4;
    }
    else{
        GPA = GPA + change;
    }
    if (change<0){ 
      scenariows = "Due to the work study, your GPA decreased by " + -1*change + ". ";
    }
    else {
        scenariows = "Despite the work study, your GPA increased by " +change + ". ";
    }
    if (happiness < 2)
        {
            this.toIntent('LoseIntent')
        }
    else if (happiness < 4)
    {
        hChange = (3-happiness)*0.5;
        GPA = GPA - hChange;
        happinessChange = "Because your happiness is below 4, your GPA dropped by "+hChange +".";
        scenariows = scenariows + happinessChange;
    }

    if (GPA < 2.0)
    {
        this.toIntent('LoseIntent');
    }
}
app.setHandler({
    LAUNCH() {
        console.log("launched");
        let background = 'You’re a senior in high school, trying to decide what to do for next year. You live in a middle-class family, with a household income of 65,000 dollars. You’ve been accepted to a good state school, and your tuition is 20,000 dollars a year. Your parents can’t contribute to this tuition. You have the option to either get a bachelor’s degree, or to get a job in the workforce. If you get a job, you’ll make 30,000 dollars a year. Will you go to college or get a job?';
        let repeat = 'Will you go to college or get a job?';
        this.ask(background,repeat);
    },
    BeginningYearIntent(){
        year++;
        grade++;
        console.log(debt+"");
        debt = debt * 1.05;
        if (grade>4){
            console.log("grade 5");
            this.toIntent('OutOfCollegeIntent');
        }
        else if (year==5){
            this.toIntent('FinishIntent');
        }
        let whichYear = 'Congrats! You are now in grade '+grade+'.';
        let college = 'For the next year, you need to take out a federal loan of 20,000 dollars, which has a fixed interest rate of 5% a year. You could also participate in a work-study program and earn up to 2,500 dollars a year; however, this could affect your GPA. Would you like to do work-study?';
        if (gap == true)
        {
            college = 'You don\'t need to take out a loan because of your gap year, but you still could participate in a work-study program and earn up to 2,500 dollars a year; however, this could affect your GPA. Would you like to do work-study?';
        }
        else
        {         
            debt = debt + 20000;
            console.log(debt+"");
        }
        if (GPA > 3.8)
        {
            var chance = ((GPA-3.8)*5);
            var rand = Math.random()
            if (rand < chance)
            {
                if (gap == true)
                {
                    college = 'Congratulations! Due to your stellar grades, you\'ve received a scholarship of 10,000 dollars! The money has been added to your bank account and will accumulate interest while your balance is positive. You can also participate in a work-study program and earn up to 2,500 dollars a year; however, this could affect your GPA. Would you like to do work-study?'
                }
                else
                {
                    college = 'Congratulations! Due to your stellar grades, you\'ve received a scholarship of 10,000 dollars! You will only need to take out a loan of 10,000 for the upcoming year. You can also participate in a work-study program and earn up to 2,500 dollars a year; however, this could affect your GPA. Would you like to do work-study?'
                }
                debt = debt - 10000;
            }
        }
        
        let repeat = 'Would you like to do work-study?';
        let status = 'Your GPA is now '+GPA+', your debt level is '+debt+' and your happiness level is '+happiness+'.';
        this.followUpState('WorkStudyState').ask(whichYear + scenariows + scenario + status + college,repeat);
 
    },
    WorkStudyState: {
        YesIntent(){
            console.log("yes WS");
            ws = true;
            if (gap == true && year == 1)
            {
                debt = debt - 2500;
                console.log(debt+"");
            }
            if (grade==2){
                this.toIntent('ChooseMajorIntent');
            }
            else{ 
                this.toIntent('RandomEventIntent');
            }
        },
        NoIntent(){
            console.log("no WS");
            ws = false;
            if (gap == true && year == 1)
            {
                debt = debt;
            }
            else{
                debt = debt + 20000;
            }
            this.toIntent('RandomEventIntent');
        },
    },
    RandomEventIntent(){
        console.log("RANDOM EVENT");
        var id = Math.floor((Math.random()*4)+1);
        while (eventID.indexOf(id)>0){
            console.log("while loop");
            id = Math.floor((Math.random()*4)+1);
        }
        eventID.push(id);
        if (id==1){
            console.log('PARTY');
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
        let description = 'You have a big test in two days, but your friends want you to go to a party. You know you’ll have a fun time there. You know you should get a head-start on studying, but you’ll still have another day after the party. Will you go to the party?';
        this.followUpState('PartyState').ask(description,'will you go to the party?');
    },
    PartyState: {
        YesIntent(){
            console.log("yesparty");
            GPA = GPA - 0.2;
            happiness ++;
            updateStats();
            scenario = "Because you chose to go to the party, your GPA decreased by 0.1 and your happiness increased by 1. ";
            this.toIntent('BeginningYearIntent');
        },
        NoIntent(){
            console.log("noparty");
            happiness--;
            updateStats();
            scenario = "Because you chose not to go to the party, you maintained your GPA, but your happiness decreased by 1. ";
            this.toIntent('BeginningYearIntent'); 
        },
    },
    ConcertIntent(){
        console.log("concert intent");
        let description = 'A band you really like is having a concert nearby, and tickets are 100 dollars. Will you go?';
        this.followUpState('ConcertState').ask(description,'will you go?');
    },
    ConcertState: {
        YesIntent(){
            console.log("yesconcert");
            happiness++;    
            debt+=100;
            updateStats();
            scenario = "Because you chose to go to the concert, your happiness increased by 1, but you are 100 dollars more in debt. ";
            this.toIntent('BeginningYearIntent');
        },
        NoIntent(){
            console.log("noconcert");
            happiness--;
            updateStats();
            scenario = "Because you chose not to go to the concert, your happiness decreased by 1. ";
            this.toIntent('BeginningYearIntent');
        },
    },
    BorrowIntent(){
        console.log("borrow intent");
        let description = 'You lent 100 dollars to an acquaintance a while back, but they haven’t paid you back yet. Will you confront them more aggressively about it?';
        this.followUpState('BorrowedMoneyState').ask(description,"will you confront them?");
    },
    BorrowedMoneyState:{
        YesIntent(){
            console.log("yesmoney");
            debt = debt - 100;
            happiness = happiness - 1;
            updateStats();
            scenario = "Because you chose to confront them, you gained 100 dollars but your happiness decreased by 1. ";
            this.toIntent('BeginningYearIntent');
        },
        NoIntent(){
            console.log("nomoney");
            updateStats();
            scenario = "Because you chose not to confront them, all of your stats stayed the same. ";
            this.toIntent('BeginningYearIntent');
        },
    },
    WalletIntent(){
        console.log("wallet intent");
        let description = 'You find a wallet on the ground! Inside is 1,000 in cash, but the wallet ID belongs to one of your classmates. However, you know this classmate is really rich, and probably won’t miss the thousand dollars too much. Do you keep the wallet?';
        this.followUpState('WalletState').ask(description,"will you keep the wallet?");
    },
    WalletState:{
        YesIntent(){
            console.log("yeswallet");
            debt = debt - 1000;
            happiness = happiness - 3;
            updateStats();
            scenario = "Because you chose to take the wallet, you gained 1000 dollars but your happiness decreased by 3. ";
            this.toIntent('BeginningYearIntent');
        },
        NoIntent(){
            console.log("nowallet");
            happiness ++;
            updateStats();
            scenario = "Because you chose not to take the wallet, your happiness increased by 1. ";
            this.toIntent('BeginningYearIntent');
        },
    },
    GapYearIntent(){
        year++;
        gap = true;
        let description = 'You chose to take a gap year! This year, you earned 20,000 dollars, which is enough to pay for one year of school. Now, please say go to college to attend college!';
        this.ask(description, 'please say go to college');
    },
    LoseIntent(){
        console.log("lose");
        let description = "";
        if (GPA<2.0){
            description = 'You lost! Your GPA dropped below 2.0. ';
        }
        else {
            description = 'You lost! Your happiness level dropped below 0.';
        }
        let finance = 'You finished with ' + debt + ' dollars in debt. Your GPA was '+ GPA + ' and your happiness level was '+happiness+".";
        this.tell(description+finance);
    },
    ChooseMajorIntent(){
        console.log("choose major");
        let background = 'Now that you\'ve been in college for a year, it\s time to choose a major! What kind of major will you choose, engineering or liberal arts?';
        let repeat = 'What kind of major will you choose, engineering or liberal arts?';
        this.ask(background,repeat);
    },
    LiberalArtsIntent(){
        console.log("liberal arts");
        major = "liberal arts";
        salary = 65000;
        this.toIntent('RandomEventIntent');
    },
    EngineeringIntent(){
        major = "engineering";
        salary = 85000;        
        this.toIntent('RandomEventIntent');
    },
    FinishIntent(){
        this.tell("Congratulations, you have finished the game! Your current debt is " + debt + " dollars, and your current salary is " + salary + " dollars.");
    }, 
    OutOfCollegeIntent(){
        console.log("OUTOFCOLLEGE");
        debt=debt-salary;
        let background = "Hooray, you're out of college! You finished with a GPA of "+GPA+" and a happiness level of "+happiness+" .Your salary right now is " + salary + " dollars. Congratulations, you have finished the game! Your current debt is" + debt + " dollars, and your current salary is " + salary + " dollars.";
        console.log("BEFOREBACKGROUND");
        this.tell(background,"");
        this.endSession();
        console.log("AFTERBACKGROUND");
    },

});

module.exports.app = app;
