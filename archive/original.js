/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/
var http = require('http');
var https = require('https');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Lambda lacks the root for iasqu SSL

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).


const handlers = {
    'servstat': function () {
        this.emit('GetFact');
    },
    
    'randomword': function () {
        this.emit('doMakeAWord');
    },
    
    'LaunchRequest' : function() {
        const speechOutput = 'Remoggle is ready.';
        this.response.speak(speechOutput)
        this.emit(':responseReady');
    },
    
  'GetFact': function() {
    var ap1 = ['app server' , 'iasqu' , 'the app server' , 'oops'];
    var ws1 = ['ollie', 'oli', 'web server', 'the web server', 'oliver'];
    var mydata = this.event.request.intent.slots.servername.value.toLowerCase();
    
    var myserver = 'x';
    var wiggy = slotValue(this.event.request.intent.slots.servername, true);
    console.log(wiggy);
    
    if (ap1.indexOf(mydata)!=-1) {
        myserver = 'https://live.iasqu.com/alex.php?svr=';
    }

    if (ws1.indexOf(mydata)!=-1) {
        myserver = 'https://frank.sikernitsky.com/card/alex.php?svr=';
    }
    
    if (myserver=='x') { this.emit(':tell', 'I did not understand what server you wanted.');return;}
    
    console.log('mydata:', mydata);
    var responseString = '';
    var mythis = this;
    https.get(myserver + mydata , (res) => {
      console.log('statusCode:', res.statusCode);
      
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        responseString += d;
      });

      res.on('end', function(res) {
        const outObj = JSON.parse(responseString)
        const speechOutput = outObj.response;
        console.log('==> Answering: ', speechOutput);
        
        mythis.response.cardRenderer('Server Info : ' + mydata, speechOutput);
        mythis.response.speak(speechOutput);
        mythis.emit(':responseReady');
        
        // mythis.emit(':tell', speechOutput);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  
  
  
       // const speechOutput = named + ' is running at ' + servIndex + ' percent.';
       // this.emit(':tellWithCard', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Help Me!';
        const reprompt = 'Help Me Again!';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'OK I\'ll stop.');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Bye!.');
    },
    
      'doMakeAWord': function() {
        
var suffixes = ['able', 'acy', 'ade', 'age', 'al', 'al', 'an', 'ance', 'ancy', 'ant', 'ant', 'ar', 'ard', 'art', 'ary', 'ate', 'ate', 'ate', 'ation', 'ative', 'cade', 'cy', 'drome', 'ed', 'ed', 'en', 'en', 'ence', 'ence', 'ency', 'ency', 'ent', 'ent', 'eous', 'er', 'er', 'er', 'ery', 'es', 'es', 'ess', 'est', 'fold', 'ful', 'ful', 'fy', 'ia', 'ial', 'ian', 'iatry', 'ible', 'ic', 'ic', 'ical', 'ice', 'ient', 'ier', 'ies', 'ies', 'iest', 'ify', 'ile', 'ing', 'ing', 'ing', 'ion', 'ious', 'ish', 'ism', 'ist', 'ite', 'itive', 'ity', 'ive', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'or', 'or', 'or', 'ory', 'ose', 'ous', 'ship', 'ster', 'ty', 'ure', 'ward', 'wise', 'y'];

var roots = ['a', 'ab', 'abs', 'ac', 'acer', 'acid', 'acri', 'act', 'act', 'acu', 'ad', 'aer', 'aero', 'af', 'ag', 'ag', 'ag', 'agi', 'agri', 'agro', 'al', 'alb', 'albo', 'ali', 'allo', 'alt', 'alter', 'am', 'ambi', 'ambul', 'ami', 'amor', 'an', 'an', 'an', 'ana', 'andr', 'andro', 'ang', 'anim', 'ann', 'annu', 'ano', 'ant', 'ante', 'anthrop', 'anti', 'anti', 'antico', 'ap', 'ap', 'aph', 'apo', 'aqu', 'arch', 'as', 'aster', 'astr', 'at', 'auc', 'auc', 'aud', 'audi', 'aug', 'aug', 'aur', 'aus', 'aut', 'aut', 'auto', 'bar', 'be', 'belli', 'bene', 'bi', 'bi', 'bibl', 'bibli', 'biblio', 'bine', 'bio', 'brev', 'cad', 'cad', 'calor', 'cap', 'capit', 'capt', 'capt', 'cardi', 'carn', 'cas', 'cas', 'cat', 'cata', 'cath', 'caus', 'cause', 'caut', 'ceas', 'ced', 'cede', 'ceed', 'ceiv', 'cent', 'centr', 'centri', 'cept', 'cess', 'chrom', 'chron', 'cid', 'cide', 'cip', 'circum', 'cis', 'cise', 'cit', 'civ', 'claim', 'clam', 'clin', 'clud', 'clus claus', 'co', 'cog', 'cogn', 'col', 'coll', 'com', 'com', 'con', 'con', 'contr', 'contra', 'cor', 'cor', 'cord', 'corp', 'cort', 'cosm', 'counter', 'cour', 'cracy', 'crat', 'cre', 'crea', 'crease', 'crease', 'cred', 'cresc', 'cresc', 'cret', 'cret', 'crit', 'cru', 'cur', 'cur', 'cura', 'curr', 'curs', 'curs', 'cus', 'cuse', 'cycl', 'cyclo', 'de', 'dec', 'deca', 'dei', 'dem', 'demo', 'dent', 'derm', 'di', 'dia', 'dic', 'dict', 'dif', 'dign', 'dis', 'dit', 'dit', 'div', 'doc', 'doct', 'domin', 'don', 'dont', 'dorm', 'dox', 'duc', 'duct', 'dura', 'dy', 'dynam', 'dys', 'e', 'ec', 'eco', 'ecto', 'em', 'en', 'end', 'enni', 'epi', 'equi', 'erg', 'et', 'ev', 'ex', 'exter', 'extra', 'extro', 'fa', 'fac', 'fact', 'fain', 'fall', 'fals', 'fan', 'fant', 'fas', 'fea', 'feat', 'fec', 'fect', 'feder', 'feign', 'femto', 'fer', 'fess', 'fic', 'fic', 'fid', 'fid', 'fide', 'fig', 'fila', 'fili', 'fin', 'fit', 'fix', 'flect', 'flex', 'flict', 'flu', 'fluc', 'fluv', 'flux', 'for', 'forc', 'fore', 'form', 'fort', 'fract', 'frag', 'frai', 'fuge', 'fuse', 'gam', 'gastr', 'gastro', 'gen', 'gen', 'geo', 'germ', 'gest', 'giga', 'gin', 'glo', 'gloss', 'glot', 'glu', 'gnant', 'gnos', 'gor', 'grad', 'graf', 'gram', 'graph', 'grat', 'grav', 'gree', 'greg', 'gress', 'hale', 'heal', 'helio', 'hema', 'hemo', 'her', 'here', 'hes', 'hetero', 'hex', 'homo', 'hum', 'human', 'hydr', 'hydra', 'hydro', 'hyper', 'hypn', 'ics', 'ig', 'ignis', 'il', 'im', 'im', 'in', 'in', 'infra', 'inter', 'intra', 'intro', 'ir', 'jac', 'ject', 'join', 'judice', 'jug', 'junct', 'junct', 'just', 'juven', 'kilo', 'labor', 'lau', 'lav', 'leag', 'lect', 'leg', 'leg', 'leg', 'levi', 'lex', 'liber', 'lide', 'lig', 'liter', 'liver', 'loc', 'loco', 'locut', 'log', 'logo', 'loqu', 'lot', 'luc', 'lude', 'lum', 'lun', 'lus', 'lust', 'lut', 'macer', 'macr', 'magn', 'main', 'mal', 'man', 'mand', 'mania', 'manu', 'mar', 'mari', 'matri', 'medi', 'mega', 'mem', 'ment', 'mer', 'meso', 'meta', 'meter', 'metr', 'micro', 'migra', 'mill', 'milli', 'min', 'mis', 'miss', 'mit', 'mob', 'mon', 'mono', 'mor', 'morph', 'mort', 'mot', 'mov', 'multi', 'nai', 'nano', 'nasc', 'nasc', 'nat', 'nat', 'neo', 'neur', 'noc', 'nom', 'nom', 'nomen', 'nomin', 'non', 'non', 'nov', 'nox', 'numer', 'numisma', 'nym', 'ob', 'oc', 'oct', 'of', 'oligo', 'ology', 'omni', 'onym', 'op', 'oper', 'ortho', 'over', 'pac', 'pair', 'paleo', 'pan', 'para', 'pare', 'pass', 'pat', 'pater', 'path', 'path', 'pathy', 'patr', 'ped', 'pedo', 'pel', 'pend', 'pens', 'penta', 'per', 'peri', 'phage', 'phan', 'phant', 'phas', 'phe', 'phen', 'phil', 'phlegma', 'phobia', 'phobos', 'phon', 'phot', 'photo', 'pico', 'pict', 'plac', 'plais', 'pli', 'plore', 'plu', 'plur', 'plus', 'ply', 'pneuma', 'pneumon', 'pod', 'pod', 'poli', 'poly', 'pon', 'pond', 'pop', 'port', 'portion', 'pos', 'post', 'pot', 'pound', 'pre', 'prehendere', 'prim', 'prime', 'prin', 'pro', 'proto', 'psych', 'puls', 'punct', 'pur', 'pute', 'quad', 'quat', 'quer', 'quest', 'quint', 'quip', 'quir', 'quis', 're', 'recti', 'reg', 'retro', 'ri', 'ridi', 'risi', 'rog', 'roga', 'rupt', 'sacr', 'salu', 'salv', 'sanc', 'sanct', 'sat', 'satis', 'scen', 'sci', 'scientia', 'scio', 'scope', 'scrib', 'script', 'se', 'sec', 'secr', 'sect', 'secu', 'sed', 'semi', 'sen', 'sens', 'sent', 'sept', 'sequ', 'serv', 'ses', 'sess', 'sid', 'sign', 'signi', 'simil', 'simul', 'sist', 'soci', 'sol', 'solu', 'solus', 'solut', 'solv', 'somn', 'soph', 'spec', 'spect', 'sper', 'sphere', 'spi', 'spic', 'spir', 'st', 'sta', 'sta', 'stab', 'stan', 'stand', 'stant', 'stat', 'stead', 'sti', 'stige', 'stit', 'strain', 'strict', 'string', 'stroy', 'stru', 'struct', 'stry', 'sub', 'suc', 'sue', 'suf', 'sume', 'sump', 'sup', 'super', 'supra', 'sur', 'sus', 'sym', 'syn', 'tact', 'tag', 'tain', 'tain', 'tang', 'tect', 'teg', 'tele', 'tem', 'tempo', 'ten', 'ten', 'tend', 'tens', 'tent', 'tent', 'tera', 'term', 'terr', 'terra', 'test', 'the', 'theo', 'therm', 'thesis', 'thet', 'tig', 'tin', 'tin', 'ting', 'tire', 'tom', 'tor', 'tors', 'tort', 'tox', 'tra', 'tract', 'trai', 'trans', 'treat', 'tri', 'trib', 'tribute', 'turbo', 'typ', 'ultima', 'umber', 'umbraticum', 'un', 'uni', 'vac', 'vade', 'vale', 'vali', 'valu', 'vect', 'veh', 'ven', 'vent', 'ver', 'verb', 'veri', 'vers', 'vert', 'verv', 'vi', 'vic', 'vicis', 'vict', 'vid', 'vinc', 'vis', 'vita', 'viv', 'vivi', 'voc', 'voke', 'vol', 'vol', 'volcan', 'volt', 'volv', 'vor', 'with', 'zo'];

console.log('Roots: ' + roots.length + ' Suffixes: ' + suffixes.length);
var root1 = roots[Math.floor(Math.random()*roots.length)];
var word = root1;

if (Math.random() >= 0.5) { 
var word=word + roots[Math.floor(Math.random()*roots.length)];
}

//if (Math.random() >= 0.5) { 
//var word=word + roots[Math.floor(Math.random()*roots.length)];
//}

var suffix = suffixes[Math.floor(Math.random()*suffixes.length)];

var word = word + suffix;

console.log (word);

          console.log (word);
          var spelled = '';
        this.response.cardRenderer('Made-Up Word : ' + word);
        
        for (var i = 0; i < word.length; i++) {
            spelled=spelled + ', ' + word.charAt(i);
        }
        console.log (spelled);

        this.response.speak('The word is ' + word + '. ' + spelled + '. ' + word);
        this.emit(':responseReady');
        
        //  this.emit(':tell', 'The word is ' + word);
          return;
          
      }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


function slotValue(slot, useId){
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}