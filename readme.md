
 # Remoggle v1.02
 ### A fun Alexa skill that creates nonsense English words
 By F. Sikernitsky, January 2018
 
 ##### About
 Based loosely on the nodejs ASK example. This is a one-shot ALexa skill that creates words.
>   - Takes common roots and suffixes to create nonsense words.
>   - Every run will combine one root + one suffix. 
>   - There is a 15% chance it adds a second root syllable (= root+root+suffix) 
 
##### Requirements
 >- Requires alexa SDK, the back end was creatded for node.js on Lambda
 >- Includes English dictionary of 370,000, loaded into an array, as a cross-check
>- The exclusion word lists contain ~360,000 words and variants, 
     including curse words and other inapropriate content in the unlikely
     case the algoritm creates something inapropriate. 

##### English Word Algorithm in English

1. Make a Random Word 
          a . Pick random word root
          b. 15% of the time, pick a second root and append it
          c. Pick a random suffix and append it
2. Exclude bad and existing words
          a. exclude sequences that make poor words \
           b. exclude any words in the English dictionary
           b. exclude any manually-overridden words

3. Alexa returns the word and its spelling
4. A card is returned with a little extra commentary built from preset phrases
 
##### Files

The root contains the deployment files for Lambda
The config-alexa contains the JSON for the voice response model

*NOTE: in the Lambda nodejs environment, the full word list would not load, so it was split into two files*

 
