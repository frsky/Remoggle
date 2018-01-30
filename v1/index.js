/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

/**
 * Remoggle v1.02 -- a fun Alexa skill that creates nonsense English words
 * By F. Sikernitsky, January 2018
 * Based loosely on the nodejs ASK example
 * 
 *   - Takes common roots and suffixes to create nonsense words.
 *   - Every run will combine one root + one suffix. 
 *   - There is a 15% chance it adds a second root syllable (= root+root+suffix) 
 * 
 *   - Quality Check:
 *      1. exclude any real English word 
 *      2. exclude sequences that make poor words (e.g. 'ii', 'bf')
 *      3. exclude any manually-overridden words
 * 
 *   - The exclusion word lists contain ~360,000 words and variants, 
 *     including curse words and other inapropriate content in the unlikely
 *     case the algoritm creates something inapropriate. 
 * 
 *     NOTE: in this environment, the full word list would not load, so it was split
 * 
 *   - Alexa retruns the word and its spelling
 *   - A card is returned with a little extra commentary
 * 
 **/
 
'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL). 
const images = { smallImageUrl: 'https://s3.amazonaws.com/cdn.remoggle.com/assets/rm_cd_720_tx_b.png', largeImageUrl:'https://s3.amazonaws.com/cdn.remoggle.com/assets/rm_cd_1200_tx_b.png'};

const wordListAL = require('./words-large-al.js').wordList; // First half of exclusion list
const wordListMZ = require('./words-large-mz.js').wordList; // Second half of exclusion list
const wordList = wordListAL.concat(wordListMZ);
const wordListExtra = require('./words-extra.js').wordListExtra; // Manual addition exclusion list

const preTaglines=['Here is your new word!', 
                   'We hope you enjoy this made-up word!', 
                   'Invented just for you!', 
                   'This new word is one in forty million!'];
const taglines =  [ 'This word was lovingly hand-crafted for you.',
                   'Jabberwocky ain\'t got nothing on us.',
                   'This one is totally tweet-worthy.',
                   'Now you have to figure out what it means.',
                   'Remoggle has been ladeling out steaming hot bowls of nonsense since 2018.',
                   'Cool word, but the domain name is probably already taken.',
                   'Hot off the presses.', 
                   'Two generations of technology\'s brightest minds bring you this nonsesne word.'];

const suffixes = ['able', 'acy', 'ade', 'age', 'al', 'al', 'an', 'ance', 'ancy', 'ant', 'ant', 'ar', 'ard', 'art', 'ary', 'ate', 'ate', 'ate', 'ation', 'ative', 'cade', 'cy', 'drome', 'ed', 'ed', 'en', 'en', 'ence', 'ence', 'ency', 'ency', 'ent', 'ent', 'eous', 'er', 'er', 'er', 'ery', 'es', 'es', 'ess', 'est', 'fold', 'ful', 'ful', 'fy', 'ia', 'ial', 'ian', 'iatry', 'ible', 'ic', 'ic', 'ical', 'ice', 'ient', 'ier', 'ies', 'ies', 'iest', 'ify', 'ile', 'ing', 'ing', 'ing', 'ion', 'ious', 'ish', 'ism', 'ist', 'ite', 'itive', 'ity', 'ive', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'or', 'or', 'or', 'ory', 'ose', 'ous', 'ship', 'ster', 'ty', 'ure', 'ward', 'wise', 'y'];
const roots = ['a', 'ab', 'abs', 'ac', 'acer', 'acid', 'acri', 'act', 'acu', 'ad', 'aer', 'aero', 'af', 'ag', 'agi', 'agri', 'agro', 'al', 'alb', 'albo', 'ali', 'allo', 'alt', 'alter', 'am', 'ambi', 'ambul', 'ami', 'amor', 'an', 'ana', 'andr', 'andro', 'ang', 'anim', 'ann', 'annu', 'ano', 'ant', 'ante', 'anthrop', 'anti', 'antico', 'ap', 'aph', 'apo', 'aqu', 'arch', 'as', 'aster', 'astr', 'at', 'auc', 'aud', 'audi', 'aug', 'aug', 'aur', 'aus', 'aut', 'auto', 'bar', 'be', 'belli', 'bene', 'bi', 'bibl', 'bibli', 'biblio', 'bine', 'bio', 'brev', 'cad', 'calor', 'cap', 'capit', 'capt', 'cardi', 'carn', 'cas', 'cat', 'cata', 'cath', 'caus', 'cause', 'caut', 'ceas', 'ced', 'cede', 'ceed', 'ceiv', 'cent', 'centr', 'centri', 'cept', 'cess', 'chrom', 'chron', 'cid', 'cide', 'cip', 'circum', 'cis', 'cise', 'cit', 'civ', 'claim', 'clam', 'clin', 'clud', 'clus','claus', 'co', 'cog', 'cogn', 'col', 'coll', 'com', 'con', 'contr', 'contra', 'cor', 'cord', 'corp', 'cort', 'cosm', 'counter', 'cour', 'cracy', 'crat', 'cre', 'crea', 'crease', 'cred', 'cresc', 'cret', 'crit', 'cru', 'cur', 'cura', 'curr', 'curs', 'cus', 'cuse', 'cycl', 'cyclo', 'de', 'dec', 'deca', 'dei', 'dem', 'demo', 'dent', 'derm', 'di', 'dia', 'dic', 'dict', 'dif', 'dign', 'dis', 'dit', 'div', 'doc', 'doct', 'domin', 'don', 'dont', 'dorm', 'dox', 'duc', 'duct', 'dura', 'dy', 'dynam', 'dys', 'e', 'ec', 'eco', 'ecto', 'em', 'en', 'end', 'enni', 'epi', 'equi', 'erg', 'et', 'ev', 'ex', 'exter', 'extra', 'extro', 'fa', 'fac', 'fact', 'fain', 'fall', 'fals', 'fan', 'fant', 'fas', 'fea', 'feat', 'fec', 'fect', 'feder', 'feign', 'femto', 'fer', 'fess', 'fic', 'fic', 'fid', 'fide', 'fig', 'fila', 'fili', 'fin', 'fit', 'fix', 'flect', 'flex', 'flict', 'flu', 'fluc', 'fluv', 'flux', 'for', 'forc', 'fore', 'form', 'fort', 'fract', 'frag', 'frai', 'fuge', 'fuse', 'gam', 'gastr', 'gastro', 'gen', 'geo', 'germ', 'gest', 'giga', 'gin', 'glo', 'gloss', 'glot', 'glu', 'gnant', 'gnos', 'gor', 'grad', 'graf', 'gram', 'graph', 'grat', 'grav', 'gree', 'greg', 'gress', 'hale', 'heal', 'helio', 'hema', 'hemo', 'her', 'here', 'hes', 'hetero', 'hex', 'homo', 'hum', 'human', 'hydr', 'hydra', 'hydro', 'hyper', 'hypn', 'ics', 'ig', 'ignis', 'il', 'im', 'in', 'infra', 'inter', 'intra', 'intro', 'ir', 'jac', 'ject', 'join', 'judice', 'jug', 'junct', 'just', 'juven', 'kilo', 'labor', 'lau', 'lav', 'leag', 'lect', 'leg', 'levi', 'lex', 'liber', 'lide', 'lig', 'liter', 'liver', 'loc', 'loco', 'locut', 'log', 'logo', 'loqu', 'lot', 'luc', 'lude', 'lum', 'lun', 'lus', 'lust', 'lut', 'macer', 'macr', 'magn', 'main', 'mal', 'man', 'mand', 'mania', 'manu', 'mar', 'mari', 'matri', 'medi', 'mega', 'mem', 'ment', 'mer', 'meso', 'meta', 'meter', 'metr', 'micro', 'migra', 'mill', 'milli', 'min', 'mis', 'miss', 'mit', 'mob', 'mon', 'mono', 'mor', 'morph', 'mort', 'mot', 'mov', 'multi', 'nai', 'nano', 'nasc', 'nat', 'neo', 'neur', 'noc', 'nom', 'nomen', 'nomin', 'non', 'nov', 'nox', 'numer', 'numisma', 'nym', 'ob', 'oc', 'oct', 'of', 'oligo', 'ology', 'omni', 'onym', 'op', 'oper', 'ortho', 'over', 'pac', 'pair', 'paleo', 'pan', 'para', 'pare', 'pass', 'pat', 'pater', 'path', 'pathy', 'patr', 'ped', 'pedo', 'pel', 'pend', 'pens', 'penta', 'per', 'peri', 'phage', 'phan', 'phant', 'phas', 'phe', 'phen', 'phil', 'phlegma', 'phobia', 'phobos', 'phon', 'phot', 'photo', 'pico', 'pict', 'plac', 'plais', 'pli', 'plore', 'plu', 'plur', 'plus', 'ply', 'pneuma' ,'pneumon','pod', 'poli', 'poly', 'pon', 'pond', 'pop', 'port', 'portion', 'pos', 'post', 'pot', 'pound', 'pre', 'prehendere', 'prim', 'prime', 'prin', 'pro', 'proto', 'psych', 'puls', 'punct', 'pur', 'pute', 'quad', 'quat', 'quer', 'quest', 'quint', 'quip', 'quir', 'quis', 're', 'recti', 'reg', 'retro', 'ri', 'ridi', 'risi', 'rog', 'roga', 'rupt', 'sacr', 'salu', 'salv', 'sanc', 'sanct', 'sat', 'satis', 'scen', 'sci', 'scientia', 'scio', 'scope', 'scrib', 'script', 'se', 'sec', 'secr', 'sect', 'secu', 'sed', 'semi', 'sen', 'sens', 'sent', 'sept', 'sequ', 'serv', 'ses', 'sess', 'sid', 'sign', 'signi', 'simil', 'simul', 'sist', 'soci', 'sol', 'solu', 'solus', 'solut', 'solv', 'somn', 'soph', 'spec', 'spect', 'sper', 'sphere', 'spi', 'spic', 'spir', 'st', 'sta', 'sta', 'stab', 'stan', 'stand', 'stant', 'stat', 'stead', 'sti', 'stige', 'stit', 'strain', 'strict', 'string', 'stroy', 'stru', 'struct', 'stry', 'sub', 'suc', 'sue', 'suf', 'sume', 'sump', 'sup', 'super', 'supra', 'sur', 'sus', 'sym', 'syn', 'tact', 'tag', 'tain', 'tang', 'tect', 'teg', 'tele', 'tem', 'tempo', 'ten', 'tend', 'tens', 'tent', 'tera', 'term', 'terr', 'terra', 'test', 'the', 'theo', 'therm', 'thesis', 'thet', 'tig', 'tin', 'ting', 'tire', 'tom', 'tor', 'tors', 'tort', 'tox', 'tra', 'tract', 'trai', 'trans', 'treat', 'tri', 'trib', 'tribute', 'turbo', 'typ', 'ultima', 'umber', 'umbraticum', 'un', 'uni', 'vac', 'vade', 'vale', 'vali', 'valu', 'vect', 'veh', 'ven', 'vent', 'ver', 'verb', 'veri', 'vers', 'vert', 'verv', 'vi', 'vic', 'vicis', 'vict', 'vid', 'vinc', 'vis', 'vita', 'viv', 'vivi', 'voc', 'voke', 'vol', 'volcan', 'volt', 'volv', 'vor', 'with', 'zo'];


const totalPossible = (roots.length * roots.length * suffixes.length) - wordListExtra.length - wordList.length;

const handlers = {
    'randomword': function() {
        this.emit('doMakeAWord');
    },
    
    'howmany': function() {
        this.emit(':tell', 'Remoggle Word Maker can currently create approximately <say-as interpret-as="cardinal">' + totalPossible + '</say-as> unique nonsense words.');
    },
    
    'LaunchRequest': function() {
        this.emit('doMakeAWord');
    },
    
    'AMAZON.HelpIntent': function() {
        const speechOutput = "You can say, 'give me a nonsense word', or say, 'cancel'. What do you want to do?"
        const reprompt = "What do you want to do?";

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', '<say-as interpret-as="interjection">Good-bye.</say-as>');
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', 'Good-bye.');
    },
    
    'SessionEndedRequest': function() {
        console.log('session ended on User Quit');
    },
    
    
    
    'doMakeAWord': function() {
        console.log('Roots: ' + roots.length + ' Suffixes: ' + suffixes.length + ' Check Words: ' + wordList.length + ' Extra Words: ' + wordListExtra.length);

        do {
            var root1 = roots[Math.floor(Math.random() * roots.length)];
            var word = root1;
            if (Math.random() >= 0.80) {
                var word = word + roots[Math.floor(Math.random() * roots.length)];
            }
            if (Math.random() >= 0.99) { 
                var word = word + roots[Math.floor(Math.random() * roots.length)];
            }
            var suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            var word = word + suffix;
            console.log(word);
        } while ((word.indexOf('ii') >= 0) || (word.indexOf('tj') >= 0) || (word.indexOf('tf') >= 0) || (word.indexOf('mf') >= 0) || (word.indexOf('aa') >= 0) || (word.indexOf('bf') >= 0) || (word.indexOf('tg') >= 0) || (word.indexOf('tq') >= 0) || (word.indexOf('uu') >= 0) || (word.indexOf('dj') >= 0) || (wordList.indexOf(word.toUpperCase()) >= 0) || (wordListExtra.indexOf(word.toUpperCase()) >= 0))

 
        console.log(word);

        var spelled = word.charAt(0);
        
        this.response.cardRenderer('New Word: ' + word, preTaglines[Math.floor(Math.random() * preTaglines.length)] + ' ' + taglines[Math.floor(Math.random() * taglines.length)], images);
        for (var i = 1; i < word.length; i++) {
            spelled = spelled + ', ' + word.charAt(i);
        }
        
        console.log(spelled);
        
        this.response.speak('The word is ' + word + '. <p>' + spelled + '.</p> ' + word);
        this.emit(':responseReady');
        
        //  this.emit(':tell', 'The word is ' + word);
        return;
    }
};
exports.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};