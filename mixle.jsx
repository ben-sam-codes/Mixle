import { useState, useEffect, useCallback, useRef } from "react";

// --- Word list (common 5-letter words for validation) ---
const WORDS = new Set([
  // A
  "abaci","aback","abaft","abase","abash","abate","abbey","abbot","abhor","abide","abled","abler","abode","abort","about","above","abuse","abuts","abyss","acids","ached","aches","acidy","acing","acini","ackee","acmes","acned","acnes","acorn","acres","acrid","acted","actin","actor","acute","adage","added","adder","addle","adept","adieu","admin","admit","adobe","adopt","adore","adorn","adult","adzes","aegis","aeons","aerie","affix","afire","afoot","afoul","after","again","agate","agave","agent","aggro","aging","agile","agios","agist","aglow","agone","agony","agree","ahead","ahold","aided","aider","aides","ailed","aimed","aimer","aired","airer","aisle","alarm","album","alder","alert","algae","algal","alias","alibi","alien","align","alike","aline","alive","allay","alley","allot","allow","alloy","allude","aloft","aloha","alone","along","aloof","aloud","alpha","altar","alter","altos","alums","amass","amaze","amber","ambit","amble","amend","amino","amiss","amity","among","amour","ample","amply","amuck","amuse","ancho","angel","anger","angle","angry","angst","anime","anise","ankle","annex","annoy","annul","anode","antic","antis","antsy","anvil","aorta","apart","aphid","apnea","apple","apply","apron","aptly","arbor","ardor","areal","arena","argon","argue","arils","arise","armed","armor","aroma","arose","array","arrow","arson","artsy","ascot","ashen","ashes","aside","asked","asker","aspen","aspic","assay","asset","aster","atoll","atoms","atone","attic","audio","audit","auger","aught","aunts","aunty","aural","auras","autos","avail","avert","avian","avoid","await","awake","award","aware","awash","awful","awing","awned","awoke","axial","axils","axing","axiom","axion","axles","ayahs","azalea","azure",
  // B
  "babel","babes","backs","bacon","badge","badly","bagel","baggy","bails","baits","baked","baker","bakes","bales","balks","balky","balls","balms","balmy","banal","bands","bands","banes","bangs","banjo","banks","barbs","bards","bared","barer","bares","barge","barks","barmy","barns","baron","barre","basal","based","baser","bases","basic","basil","basin","basis","basks","bass","baste","batch","bated","bathe","baths","batik","baton","batty","bawdy","bawls","bayou","beach","beads","beady","beaks","beams","beans","beard","bears","beast","beats","beaus","beaux","beech","beefs","beefy","beeps","beers","beery","beets","began","beget","begin","begun","beige","being","belay","belch","belie","belle","bells","belly","below","belts","bench","bends","bendy","beret","bergs","berry","berth","beset","betel","bevel","bible","bicep","biddy","bided","bider","bides","bidet","bigly","bigot","biked","biker","bikes","bilge","bills","billy","bimbo","binds","binge","bingo","biome","biped","birch","birds","birth","bison","bitsy","bitten","bitty","black","blade","blame","bland","blank","blare","blase","blast","blaze","bleak","bleat","bleed","blend","bless","blimp","blind","blink","blips","bliss","blitz","bloat","blobs","block","blocs","bloke","blond","blood","bloom","blown","blows","bluer","blues","bluff","blunt","blurb","blurs","blurt","blush","board","boast","boats","bobby","boded","bodes","bodge","bogey","boggy","bogus","boils","bolts","bolus","bombs","bonds","boned","boner","bones","bongo","bonus","booby","books","booms","boomy","boons","boost","booth","boots","booty","booze","boozy","borax","bored","borer","bores","borne","boron","bossy","botch","bound","bouts","bowed","bowel","bower","bowls","boxed","boxer","boxes","brace","bract","brags","braid","brain","brake","brand","brash","brass","brave","bravo","brawl","brawn","brays","bread","break","breed","brews","bribe","brick","bride","brief","brine","bring","brink","briny","brisk","broad","broil","broke","brood","brook","broom","broth","brown","brows","brush","brunt","brute","bucks","buddy","budge","buds","buffs","buggy","bugle","build","built","bulbs","bulge","bulky","bulla","bulls","bully","bumps","bumpy","bunch","bunks","bunny","bunts","buoys","burst","buses","bushy","busts","busty","butch","butte","butts","buyer","bylaw","bytes",
  // C
  "cabal","cabin","cable","cabot","cacao","cache","cacti","caddy","cadet","cadge","cafes","caged","cager","cages","cagey","cairn","caked","cakes","calls","calms","calve","camel","cameo","camps","campy","canal","candy","caned","canes","canid","canna","canny","canoe","canon","caper","caped","capes","cards","cared","carer","cares","cargo","carol","carry","carve","cases","caste","catch","cater","cause","caves","cedar","cells","cents","chain","chair","chalk","champ","chant","chaos","chaps","chard","charm","chars","chart","chase","cheap","cheat","check","cheek","cheer","chess","chest","chick","chide","chief","child","chile","chili","chill","chime","china","chips","chirp","chive","choir","choke","chomp","chord","chore","chose","chunk","churn","chute","cider","cigar","cinch","circa","cited","cites","civic","civil","clack","claim","clamp","clams","clang","clank","clans","claps","clash","clasp","class","claws","clean","clear","cleat","clerk","click","cliff","climb","cling","clink","clips","cloak","clock","clone","close","cloth","cloud","clout","clove","clown","clubs","cluck","clued","clues","clump","clung","clunk","coach","coast","coats","cobra","cocoa","cocos","coded","coder","codes","coils","coins","colds","colon","color","colts","combo","comes","comet","comfy","comic","comma","conch","condo","cones","coral","cords","cored","cores","corgi","corns","corny","corps","costs","couch","could","count","coupe","coups","court","cover","covet","crack","craft","cramp","crams","crane","crank","craps","crash","crass","crate","crave","crawl","craze","crazy","creak","cream","creed","creek","creep","crepe","crept","crest","crews","cribs","crick","cried","crier","cries","crime","crimp","crisp","crits","croak","crock","crony","crook","crops","cross","crowd","crown","crude","cruel","cruet","crumb","crush","crust","crypt","cubic","cubes","cuffs","cults","cumin","cunts","cupid","curbs","curds","cured","cures","curls","curly","curry","curse","curve","curvy","cushy","cutie","cycle","cynic",
  // D
  "daddy","daily","dairy","daisy","dally","dance","dandy","dared","darer","dares","darks","darns","darts","dated","dater","dates","datum","daunt","dawns","deals","dealt","dears","death","debit","debut","debug","decal","decay","decks","decor","decoy","decoy","decry","deeds","deems","deity","delay","delft","delta","delve","demon","demur","denim","dense","depot","depth","derby","deter","detox","deuce","devil","diary","diced","dicer","dices","dicey","digit","dimly","dined","diner","dines","dingo","dingy","dirty","disco","ditch","ditto","ditty","divan","diver","dives","dizzy","docks","dodge","dodgy","doers","dogma","doing","dolls","dolly","domes","donor","donut","dooms","doors","dopey","dosed","doses","dotty","dough","douse","dowdy","dowel","downs","downy","dozed","dozen","dozes","draft","drain","drake","drama","drank","drape","drawl","drawn","draws","dread","dream","dress","dried","drier","dries","drift","drill","drink","drips","drive","droit","droll","drone","drool","droop","drops","dross","drove","drown","drugs","drums","drunk","dryer","dryly","duals","ducal","ducks","ducts","dudes","duels","duets","duffs","dulls","dummy","dumps","dumpy","dunce","dunes","dunks","duped","dupes","dusty","dutch","dwarf","dwell","dwelt","dying",
  // E
  "eager","eagle","early","earns","earth","eased","easel","eater","eater","eaves","ebbed","ebony","edged","edger","edges","edict","edify","eerie","eight","eject","elate","elbow","elder","elect","elfin","elite","elope","elude","elves","email","embed","ember","emcee","emoji","emote","empty","enact","ended","endow","enemy","enjoy","ennui","enact","ensue","enter","entry","envoy","epoch","equal","equip","erase","erect","erode","error","erupt","essay","ether","ethic","evade","event","every","evict","evoke","exact","exalt","exams","excel","exert","exile","exist","expat","expel","extra","exude","exult",
  // F
  "fable","faced","facer","faces","facet","facts","faddy","faded","fades","fails","faint","fairy","faith","faked","faker","fakes","falls","false","famed","fames","fancy","fangs","farce","farms","fatal","fatty","fault","fauna","favor","fawns","feast","feats","fecal","feeds","feels","feign","feint","fella","felon","femur","fence","fends","feral","ferry","fests","fetal","fetch","fetid","fetus","feud","feuds","fever","fewer","fiber","fibre","ficus","field","fiend","fiery","fifth","fifty","fight","filch","filed","filer","files","filet","fills","filly","films","filmy","filth","final","finch","finds","fined","finer","fines","fired","fires","firms","first","fishy","fists","fitly","fits","five","fiver","fives","fixed","fixer","fixes","fizzy","fjord","flack","flags","flair","flake","flaky","flame","flank","flaps","flare","flash","flask","flats","flaws","flaxy","fleas","fleck","flesh","flick","flier","flies","fling","flint","flips","flirt","float","flock","flood","floor","flora","floss","flour","flout","flows","flubs","flues","fluff","fluid","fluke","fluky","flung","flunk","flush","flute","foamy","focal","focus","foggy","foils","folds","folio","folks","folly","fonts","foods","fools","foray","force","forge","forgo","forks","forms","forte","forth","forty","forum","found","fount","fours","foxes","foyer","frail","frame","frank","fraud","frays","freak","freed","freer","fresh","friar","fried","frier","fries","frisk","frizz","frock","frogs","frolic","front","frost","froth","froze","fruit","frump","fudge","fuels","fugal","fully","fumed","fumes","funds","fungi","funky","funny","furry","fused","fuses","fussy","fusty","fuzzy",
  // G
  "gaily","gains","gaits","gales","gamer","games","gamma","gamut","gangs","gaped","gapes","garbs","gases","gasps","gates","gaudy","gauge","gaunt","gauze","gauzy","gavel","gazer","gazes","gears","geeks","geeky","geese","genie","genre","genus","germs","ghost","giant","gifts","giddy","giggle","gilds","gills","giddy","girth","given","giver","gives","gizmo","glad","glade","gland","glare","glass","glaze","gleam","glean","glide","glint","globe","gloom","glory","gloss","glove","glows","glued","glues","glyph","gnarly","gnash","gnats","gnaws","gnome","goads","goats","godly","going","golds","golfs","goner","gongs","goods","gooey","goofs","goofy","goose","gorge","gory","gouge","gourd","grace","grade","grads","graft","grain","grams","grand","grant","grape","graph","grasp","grass","grate","grave","gravy","grays","graze","great","greed","greek","green","greet","grief","grill","grime","grimy","grind","grins","gripe","grips","grits","groan","groat","groin","groom","grope","gross","group","grout","grove","growl","grown","grows","grubs","gruel","gruff","grump","grunt","guano","guard","guava","guess","guest","guide","guild","guilt","guise","gulch","gulls","gulps","gummy","gumps","gunky","guppy","gusts","gusty","gutsy","gutter",
  // H
  "habit","hadn","haiku","hairs","hairy","hales","halls","halts","halve","hands","handy","hangs","happy","hardy","harem","harms","harps","harpy","harry","harsh","haste","hasty","hatch","hated","hater","hates","hauls","haunt","haven","havoc","hawks","hazel","heads","heady","heals","heaps","heard","hears","heart","heats","heavy","hedge","heeds","heels","hefty","heirs","heist","hello","helps","hence","henry","herbs","herds","heron","hertz","hexed","hides","highs","hiked","hiker","hikes","hills","hilly","hilts","hinds","hinge","hints","hippo","hippy","hired","hires","hitch","hives","hoard","hoary","hobby","hobos","hoist","holds","holed","holes","holly","homer","homes","homey","honey","honor","hoods","hoofs","hooks","hooky","hoops","hoped","hopes","horde","horns","horny","horse","horsy","hosed","hoses","hosts","hotel","hotly","hound","hours","house","hovel","hover","howdy","howls","hubby","huffs","huffy","hulks","hulky","human","humid","humps","humpy","humus","hunch","hunks","hunky","hunts","hurls","hurry","hurts","husks","husky","hutch","hyena","hymen","hymns","hyper","hypos",
  // I
  "icing","icons","ideal","ideas","idiom","idiot","idled","idler","idles","idols","igloo","image","imbue","impel","imply","inane","incur","index","indie","inept","inert","infer","inger","ingot","inked","inlay","inlet","inman","inner","input","intel","inter","intro","ionic","irate","irked","irony","ivory","issue","items","ivied","ivies",
  // J
  "jab","jabot","jacks","jaded","jails","jambs","jammed","japes","jaunt","jaunts","jazzy","jeans","jeeps","jeers","jelly","jenny","jerks","jerky","jest","jests","jewel","jiffy","jig","jimmy","jived","jives","jockey","joins","joint","joked","joker","jokes","jolly","jolts","joshed","joust","joust","jowls","judge","juice","juicy","jumbo","jumps","jumpy","junco","junky","juror","juicy","julep","jumpy",
  // K
  "kayak","kebab","keels","keeps","kennel","kerbs","khaki","kicks","kills","kilts","kinds","kiosk","kites","knack","knave","knead","kneed","kneel","knees","knelt","knife","knits","knobs","knock","knoll","knots","known","knows","knurl","koala",
  // L
  "label","labor","laced","laces","lacks","laden","ladle","lager","lagoon","laird","lakes","lambs","lamed","lamer","lamps","lance","lands","lanes","lanky","lapel","lapse","large","larks","larva","laser","lasso","lasts","latch","later","latex","lathe","latte","lauds","laugh","lavas","lawns","layer","leads","leafy","leaks","leaky","leans","leaps","leapt","learn","lease","leash","least","leave","ledge","leech","leeks","lefts","lefty","legal","leggy","lemma","lemon","lends","leper","level","lever","libel","lifts","light","liked","liken","liker","likes","lilac","lilts","limbo","limbs","limed","limes","limit","limps","lined","linen","liner","lines","lingo","links","lions","lipid","lists","liter","lithe","lived","liven","liver","lives","livid","llama","loads","loafs","loams","loamy","loans","loath","lobby","lobes","local","locks","locus","lodge","lofts","lofty","logic","login","loins","loner","longs","looks","looms","loony","loops","loopy","loose","loots","lords","lorry","loser","loses","lossy","lotto","lotus","lousy","louse","loved","lover","loves","lower","lowly","loyal","lucid","lucky","lulls","lumps","lumpy","lunar","lunch","lunge","lungs","lurch","lured","lurer","lures","lurks","lusty","lyric",
  // M
  "macho","macro","madam","madly","mafia","magic","magma","major","maker","makes","males","malls","malts","mamas","mamma","mambo","manes","manga","mange","mango","mania","manic","manly","manor","maple","march","mares","marks","marry","marsh","masks","mason","match","mated","mates","maths","matte","mauls","maven","maxed","maxes","mayor","mazes","mealy","means","meant","meats","meaty","medal","media","medic","meeds","meets","melee","melon","melts","memo","memos","mends","menus","mercy","merge","merit","merry","messy","metal","meter","metre","micro","midst","might","milds","miles","milks","milky","mills","mimic","mince","minds","mined","miner","mines","minor","mints","minty","minus","mirth","miser","missy","mists","misty","miter","mitre","mitts","mixed","mixer","mixes","moans","moats","mocks","model","modem","modes","moist","molar","molds","moldy","moles","molls","molts","momma","mommy","money","monks","month","moods","moody","moons","moose","moral","morel","mores","morph","mossy","motel","moths","motif","motor","motto","mould","moult","mound","mount","mourn","mouse","mousy","mouth","moved","mover","moves","movie","mowed","mower","mucus","muddy","muffs","mulch","mules","mulls","multi","mummy","mumps","munch","mural","murky","music","musks","musky","mussy","musty","muted","muter","mutes","mutts","myrrh","myths",
  // N
  "nag","nails","naive","naked","named","names","nanny","nap","napes","nappy","narcs","nasal","nasty","natal","naval","navel","neaps","nears","necks","needs","needy","negro","nerve","nervy","nests","never","newer","newly","nexus","nicer","niche","nicks","niece","night","nimby","ninja","ninth","noble","nobly","noise","noisy","nomad","nonce","nooks","norms","north","nosed","noses","nosey","notch","noted","notes","nouns","novel","nudge","nurse","nutty","nylon","nymph",
  // O
  "oaken","oasis","oaths","occur","ocean","ochre","octet","oddly","odder","offal","offed","offer","often","ogled","ogler","ogles","oiled","oinks","olive","omega","onset","oomph","oozed","oozes","opens","opera","optic","opted","optic","orbit","order","organ","other","otter","ought","ounce","outdo","outed","outer","outgo","ovary","ovate","ovens","overt","ovoid","owing","owned","owner","oxide","ozone",
  // P
  "paced","pacer","paces","packs","paddy","padre","pagan","paged","pager","pages","pails","pains","paint","pairs","paler","pales","palms","palsy","panda","paned","panel","panes","pangs","panic","pansy","pants","paper","parch","pared","pares","paris","parks","parse","parts","party","pasta","paste","pasty","patch","patio","patsy","patty","pause","paved","paver","paves","pawed","pawns","peace","peach","peaks","pearl","pears","pease","pecan","pecks","pedal","peeks","peels","peeps","peers","penal","pence","penny","perch","peril","perks","perky","perms","pesto","pests","petal","peter","petty","phase","phone","photo","piano","picks","picky","piece","piers","piggy","piled","piles","pills","pilot","pimps","pinch","pined","pines","pinks","pinky","pints","pious","piped","piper","pipes","pique","pitch","piths","pithy","piton","pitts","pivot","pixel","pixie","pizza","place","plaid","plain","plane","plank","plans","plant","plate","plaza","plead","pleas","pleat","plied","plier","plies","plods","plops","plots","plows","ploys","pluck","plugs","plumb","plume","plump","plums","plums","plunk","plush","plying","poach","pocks","poems","poets","point","poise","poked","poker","pokes","polar","poled","poles","polls","polyp","ponds","pools","poops","popes","poppy","porch","pored","pores","porky","ports","posed","poser","poses","posit","posse","posts","potty","pouch","pound","pours","power","prank","prawn","prays","press","prexy","price","prick","pride","pried","pries","prime","primo","prims","print","prior","prism","privy","prize","probe","prods","proem","profs","promo","proms","prone","prong","proof","props","prose","proud","prove","prowl","prude","prune","psalm","pubes","pubic","pucks","pudgy","puffs","puffy","pulls","pulps","pulpy","pulse","pumps","punch","punks","punky","punny","pupil","puppy","puree","purge","purrs","purse","pushy","pussy","putts","putty","pygmy",
  // Q
  "quack","quaff","quail","quake","qualm","quark","quart","quasi","queen","queer","quell","query","quest","queue","quick","quiet","quill","quilt","quirk","quota","quote","quoth",
  // R
  "rabbi","rabid","raced","racer","races","racks","radar","radii","radio","radon","rafts","raged","rages","raids","rails","rainy","raise","rajah","raked","raker","rakes","rally","ramps","ranch","range","rangy","ranks","rants","rapid","rated","rates","ratio","raved","ravel","raven","raves","rayon","razor","reach","react","reads","ready","realm","reams","reaps","rears","rebel","rebid","rebus","rebut","recap","recut","reeds","reedy","reefs","reeks","reels","refer","regal","rehab","reign","reins","relax","relay","relic","remit","renal","renew","rents","repay","repel","reply","rerun","reset","resin","rests","retro","retry","reuse","revel","rider","rides","ridge","rifle","rifts","right","rigid","rigor","riled","riles","rinds","rings","rinse","riots","ripen","riper","risen","riser","rises","risks","risky","ritzy","rival","riven","river","rivet","roads","roams","roars","roast","robed","robes","robin","robot","rocks","rocky","rodeo","rogue","roles","rolls","roman","roofs","rooks","rooms","roomy","roots","roped","ropes","roses","rosin","rotor","rouge","rough","round","rouse","route","roved","rover","rowdy","rowed","rower","royal","rubes","ruble","rucks","ruddy","rude","ruder","rugby","ruins","ruled","ruler","rules","rumba","rumor","rumps","rungs","rural","rusty",
  // S
  "saber","sable","sabot","sacks","sadly","safes","saged","sages","sagas","saint","sails","salad","sales","salty","salsa","salon","salts","salve","salvo","samba","sands","sandy","saner","saner","sangs","sapid","sappy","sassy","satin","sauce","saucy","sauna","saute","saved","saver","saves","savor","savvy","sawed","scale","scalp","scald","scaly","scamp","scams","scans","scant","scare","scarf","scary","scene","scent","schmo","scion","scoff","scold","scone","scoop","scope","scops","score","scorn","scots","scout","scowl","scram","scrap","scrub","scrum","scuba","seals","seams","seats","sedan","seeds","seedy","seems","seeps","seize","selfs","sells","sends","sense","sepia","serif","serve","setup","seven","sever","sewed","sewer","shade","shady","shaft","shake","shaky","shall","shame","shams","shape","shard","share","shark","sharp","shave","shawl","shawl","shear","sheds","sheen","sheep","sheer","sheet","shelf","shell","shift","shims","shine","shins","shiny","ships","shire","shirk","shirt","shock","shoed","shoes","shone","shook","shoot","shops","shore","shorn","short","shots","shout","shove","shown","shows","showy","shrub","shrug","shuck","shunt","sides","siege","sieve","sight","sigma","signs","silks","silky","silly","silts","since","sinew","singe","sinks","siren","sissy","sitar","sites","sixth","sixty","sized","sizes","skate","skein","skied","skier","skies","skill","skimp","skims","skins","skips","skirt","skull","skunk","slack","slain","slake","slams","slang","slant","slaps","slash","slate","slats","slave","slays","sleds","sleek","sleep","sleet","slept","slice","slick","slide","slime","slimy","sling","slink","slips","slits","slobs","slogs","slope","slops","slots","sloth","slows","slugs","slums","slump","slung","slunk","slurp","slurs","slush","slyly","smack","small","smart","smash","smear","smell","smelt","smile","smirk","smite","smith","smock","smogs","smoke","smoky","snack","snags","snail","snake","snaky","snaps","snare","snark","snarl","sneak","sneer","snide","sniff","snips","snobs","snoop","snore","snort","snots","snout","snowy","snubs","snuck","snuff","soapy","soars","sober","socks","sofas","softy","soggy","soils","solar","soled","soles","solid","solos","solve","sonar","songs","sonic","sooth","sooty","sorry","sorts","souls","sound","soupy","south","sowed","sower","space","spade","spans","spare","spark","spars","spasm","spawn","speak","spear","speck","specs","speed","spell","spend","spent","spice","spicy","spied","spiel","spies","spike","spill","spine","spins","spite","split","spoke","spoof","spook","spool","spoon","spore","sport","spots","spout","spray","spree","sprig","sprit","spuds","spunk","spurn","spurs","spurt","squad","squat","squid","stabs","stack","staff","stage","stags","staid","stain","stair","stake","stale","stalk","stall","stamp","stand","stank","stare","stark","stars","start","stash","state","stays","steak","steal","steam","steel","steep","steer","stems","steps","stern","stews","stick","stiff","still","stilts","sting","stink","stint","stirs","stock","stoic","stoke","stole","stomp","stone","stony","stood","stool","stoop","stops","store","stork","storm","story","stout","stove","stows","strap","straw","stray","strip","strut","stubs","stuck","studs","study","stuff","stump","stums","stung","stunk","stuns","stunt","style","suave","sucks","sugar","suite","suits","sulks","sulky","sunny","super","surge","sushi","swabs","swamp","swang","swans","swaps","swarm","swath","swats","swear","sweat","sweep","sweet","swell","swept","swift","swill","swims","swine","swing","swipe","swirl","swish","sword","swore","sworn","swung","syrup",
  // T
  "tabby","table","taboo","tacit","tacks","tacky","taffy","tails","taint","taken","taker","takes","tales","talks","tally","talon","tamed","tamer","tames","tango","tangs","tangy","tanks","taped","taper","tapes","tardy","tarps","taste","tasty","tatty","taunt","tawny","taxed","taxes","taxis","teach","teams","tears","teary","tease","teddy","teens","teeny","teeth","tempo","tends","tenor","tense","tenth","tents","tepee","tepid","terms","terns","tests","texts","thank","theft","their","theme","there","these","thick","thief","thigh","thing","think","third","thorn","those","three","threw","throw","thrum","thuds","thugs","thumb","thump","tidal","tided","tides","tiger","tight","tiled","tiles","tilts","timed","timer","times","timid","tinge","tinny","tippy","tipsy","tired","tires","titan","title","toast","today","toddy","toffs","toils","token","tolls","tombs","tonal","toned","toner","tones","tongs","tonic","tools","tooth","topaz","topic","topps","torch","torso","total","totem","touch","tough","tours","towel","tower","towns","toxic","trace","track","tract","trade","trail","train","trait","tramp","trans","traps","trash","trawl","trays","treat","trees","trend","triad","trial","tribe","trick","tried","trier","tries","trigo","trigs","trims","trios","trips","trite","troll","troop","trope","troth","trots","trout","trove","trows","truce","truck","truly","trump","trunk","truss","trust","truth","tulip","tumor","tunas","tuned","tuner","tunes","tunic","turbo","turds","turns","tutor","twang","tweak","tweed","tweet","twerp","twice","twigs","twill","twine","twins","twirl","twist","tying","typed","types","typos",
  // U
  "udder","ulcer","ultra","umbra","umped","unbar","uncap","uncle","uncut","under","undue","undid","unfit","unify","union","unite","units","unity","unlit","unmet","until","unwed","upper","upset","urban","urged","urges","urine","usage","usher","using","usual","usurp","utter",
  // V
  "vague","valet","valid","valor","value","valve","vanes","vapor","vault","vaunt","veers","vegan","veils","veins","veiny","venom","venue","verbs","verge","verse","verve","vexed","vexes","vibes","video","views","vigor","villa","vines","vinyl","viola","viper","viral","virus","visor","visit","vista","vital","vivid","vixen","vocal","vodka","vogue","voice","voila","volts","voter","votes","vouch","vowed","vowel","vulva",
  // W
  "wacky","waded","wader","wades","wafer","waged","wager","wages","wagon","waifs","wails","waist","waits","waked","waken","wakes","walks","walls","waltz","wands","waned","wanes","wants","wards","wares","warns","warps","warts","warty","washy","waste","watch","water","watts","waved","waver","waves","waved","waist","waxed","waxen","wears","weary","weave","webby","wedge","weeds","weedy","weeks","weeps","weepy","weigh","weird","wells","welts","wench","whale","wheat","wheel","whelp","where","which","whiff","while","whims","whine","whiny","whips","whirl","whisk","white","whole","whose","wicks","widen","wider","width","wield","wilds","wills","willy","wilts","wimps","wimpy","wince","winch","winds","windy","wines","wings","winks","wiped","wiper","wipes","wired","wires","wisps","wispy","witch","witty","wives","woken","wolfs","woman","women","woods","woody","woozy","words","wordy","works","world","worms","wormy","worry","worse","worst","worth","would","wound","wraps","wrath","wreak","wreck","wrest","wring","wrist","write","wrong","wrote","wrung",
  // XYZ
  "xenon","xerox","yacht","yanks","yards","yarns","yawns","yearn","years","yeast","yells","yelps","yield","yolks","young","yours","youth","yucca","yummy","zebra","zeros","zesty","zilch","zincs","zippy","zonal","zones","zooms"
]);

// Filter to only valid 5-letter words (catches any typos in the list)
for (const w of WORDS) {
  if (w.length !== 5) WORDS.delete(w);
}

// Scrabble-ish letter values
const LETTER_VALUES = {
  a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
};

// Letter frequency weights for drawing
const LETTER_FREQ = {
  a:8.2,b:1.5,c:2.8,d:4.3,e:12.7,f:2.2,g:2.0,h:6.1,i:7.0,j:0.15,k:0.77,l:4.0,m:2.4,n:6.7,o:7.5,p:1.9,q:0.095,r:6.0,s:6.3,t:9.1,u:2.8,v:0.98,w:2.4,x:0.15,y:2.0,z:0.074
};

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate();
}

function getDayNumber() {
  const start = new Date(2025, 0, 1);
  const now = new Date();
  return Math.floor((now - start) / 86400000);
}

function pickWeightedLetter(rng) {
  const letters = Object.keys(LETTER_FREQ);
  const weights = letters.map(l => LETTER_FREQ[l]);
  const total = weights.reduce((a,b) => a+b, 0);
  let r = rng() * total;
  for (let i = 0; i < letters.length; i++) {
    r -= weights[i];
    if (r <= 0) return letters[i];
  }
  return letters[letters.length - 1];
}

function pickWeightedVowel(rng) {
  const vowels = ['a','e','i','o','u'];
  const weights = vowels.map(v => LETTER_FREQ[v]);
  const total = weights.reduce((a,b) => a+b, 0);
  let r = rng() * total;
  for (let i = 0; i < vowels.length; i++) {
    r -= weights[i];
    if (r <= 0) return vowels[i];
  }
  return vowels[vowels.length - 1];
}

function generateAllDraws(seed) {
  const rng = seededRandom(seed);
  const rounds = [];
  for (let r = 0; r < 3; r++) {
    const draws = [];
    for (let step = 0; step < 5; step++) {
      const pool = new Set();
      pool.add(pickWeightedVowel(rng));
      while (pool.size < 4) {
        pool.add(pickWeightedLetter(rng));
      }
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      draws.push(arr);
    }
    rounds.push(draws);
  }
  return rounds;
}

function scoreWord(word) {
  const w = word.toLowerCase();
  if (!WORDS.has(w)) return { valid: false, total: 0, letterScore: 0, wordBonus: 0 };
  const letterScore = w.split("").reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  const avgValue = letterScore / 5;
  const wordBonus = Math.round(avgValue * 3);
  return { valid: true, total: letterScore + wordBonus, letterScore, wordBonus };
}

// --- Styles ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #1a1a2e;
    --bg2: #16213e;
    --surface: #0f3460;
    --accent: #e94560;
    --accent2: #f5c518;
    --green: #00c853;
    --text: #eee;
    --text-dim: #8892a4;
    --card: #1c2a4a;
    --card-hover: #253a5e;
    --radius: 12px;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    max-width: 440px;
    margin: 0 auto;
    padding: 20px 16px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header { text-align: center; margin-bottom: 20px; }

  .logo {
    font-family: 'Space Mono', monospace;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 6px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
  }

  .subhead {
    font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;
    letter-spacing: 2px; text-transform: uppercase;
  }

  .round-indicator { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }
  .round-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--surface); transition: all 0.3s;
  }
  .round-dot.active { background: var(--accent); box-shadow: 0 0 10px var(--accent); }
  .round-dot.done { background: var(--green); }
  .round-label {
    font-size: 0.75rem; color: var(--text-dim); text-align: center;
    margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
  }

  .word-slots {
    display: flex; justify-content: center; gap: 8px;
    margin-bottom: 28px; position: relative;
  }

  .slot-column {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    will-change: transform;
  }

  .slot {
    width: 58px; height: 62px;
    border: 2px solid var(--surface); border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 1.6rem; font-weight: 700; text-transform: uppercase;
    background: var(--bg2); transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    position: relative; user-select: none; -webkit-user-select: none;
  }

  .slot.filled {
    border-color: var(--accent); background: var(--surface);
    animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .slot.current {
    border-color: var(--accent2);
    box-shadow: 0 0 16px rgba(245, 197, 24, 0.25);
  }
  .slot.valid-word { border-color: var(--green); background: rgba(0, 200, 83, 0.15); }
  .slot.invalid-word { border-color: var(--accent); background: rgba(233, 69, 96, 0.1); }

  .slot.arrange-mode { border-color: var(--accent2); cursor: grab; }
  .slot.arrange-mode:active { cursor: grabbing; }
  .slot.dragging-src { opacity: 0.2; border-style: dashed; border-color: var(--text-dim); background: transparent; }
  .slot.valid-preview { border-color: var(--green); }

  .ghost-tile {
    position: fixed; pointer-events: none; z-index: 1000;
    width: 58px; height: 62px;
    border: 2px solid var(--accent2); border-radius: var(--radius);
    background: var(--surface);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 1.6rem; font-weight: 700; text-transform: uppercase;
    color: var(--text);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    transform: translate(-50%, -50%) scale(1.1);
  }

  @keyframes popIn {
    0% { transform: scale(0.7); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }

  .choices-area { text-align: center; margin-bottom: 24px; }
  .choices-label {
    font-size: 0.7rem; color: var(--text-dim);
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;
  }
  .choices { display: flex; justify-content: center; gap: 12px; }

  .choice-btn {
    width: 66px; height: 66px;
    border: 2px solid var(--surface); border-radius: var(--radius);
    background: var(--card); color: var(--text);
    font-family: 'Space Mono', monospace;
    font-size: 1.8rem; font-weight: 700; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .choice-btn:hover {
    border-color: var(--accent2); background: var(--card-hover);
    transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  .choice-btn:active { transform: translateY(0); }

  .choice-wrapper {
    position: relative; display: inline-flex;
    flex-direction: column; align-items: center; gap: 4px;
  }
  .point-badge { font-size: 0.65rem; color: var(--accent2); font-weight: 600; }

  .score-area {
    background: var(--card); border-radius: var(--radius);
    padding: 16px; margin-bottom: 16px;
  }
  .score-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 6px 0;
  }
  .score-row .label { font-size: 0.8rem; color: var(--text-dim); }
  .score-row .value { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 1rem; }
  .score-row .value.big { font-size: 1.4rem; color: var(--accent2); }

  .round-scores { display: flex; justify-content: center; gap: 12px; margin-bottom: 16px; }
  .round-score-card {
    background: var(--card); border-radius: var(--radius);
    padding: 10px 16px; text-align: center; min-width: 90px;
  }
  .round-score-card.best { border: 1px solid var(--accent2); }
  .round-score-card .rd-label {
    font-size: 0.65rem; color: var(--text-dim);
    text-transform: uppercase; letter-spacing: 1px;
  }
  .round-score-card .rd-word {
    font-family: 'Space Mono', monospace;
    font-size: 1rem; font-weight: 700; text-transform: uppercase; margin: 4px 0;
  }
  .round-score-card .rd-score { font-family: 'Space Mono', monospace; font-size: 0.85rem; color: var(--accent2); }
  .round-score-card .rd-invalid { font-size: 0.7rem; color: var(--accent); }

  .next-btn, .share-btn {
    width: 100%; padding: 14px; border: none; border-radius: var(--radius);
    font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s;
  }
  .next-btn { background: var(--accent); color: white; margin-bottom: 8px; }
  .next-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .share-btn { background: var(--green); color: white; }
  .share-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

  .result-title { text-align: center; font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; }
  .result-sub { text-align: center; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 16px; }

  .share-preview {
    background: var(--bg2); border-radius: var(--radius); padding: 14px;
    font-family: 'Space Mono', monospace; font-size: 0.75rem; line-height: 1.6;
    margin-bottom: 16px; white-space: pre-wrap; text-align: center;
  }

  .copied-toast {
    text-align: center; color: var(--green); font-size: 0.8rem;
    font-weight: 600; margin-top: 8px; animation: fadeIn 0.3s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .how-to-play { text-align: center; margin-top: auto; padding-top: 16px; }
  .how-btn {
    background: none; border: 1px solid var(--surface); color: var(--text-dim);
    padding: 8px 16px; border-radius: 20px; font-size: 0.75rem; cursor: pointer;
    font-family: 'Outfit', sans-serif; letter-spacing: 1px; text-transform: uppercase;
  }
  .how-btn:hover { border-color: var(--text-dim); color: var(--text); }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 20px; animation: fadeIn 0.2s;
  }
  .modal {
    background: var(--bg2); border-radius: 16px; padding: 28px 24px;
    max-width: 380px; width: 100%; max-height: 80vh; overflow-y: auto;
  }
  .modal h2 { font-size: 1.2rem; margin-bottom: 16px; text-align: center; }
  .modal p { font-size: 0.85rem; color: var(--text-dim); margin-bottom: 12px; line-height: 1.5; }
  .modal .close-btn {
    display: block; margin: 16px auto 0; background: var(--surface); border: none;
    color: var(--text); padding: 10px 28px; border-radius: var(--radius);
    cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 600;
  }
  .step-num {
    display: inline-block; width: 22px; height: 22px; background: var(--accent);
    border-radius: 50%; text-align: center; line-height: 22px; font-size: 0.7rem;
    font-weight: 700; color: white; margin-right: 8px; flex-shrink: 0;
  }
  .step-row { display: flex; align-items: flex-start; margin-bottom: 12px; }

  .arrange-area { text-align: center; margin-bottom: 24px; }
  .arrange-label {
    font-size: 0.75rem; color: var(--accent2);
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;
  }
  .arrange-status { margin-bottom: 4px; font-size: 0.9rem; }
  .arrange-valid { color: var(--green); font-weight: 600; }
  .arrange-invalid { color: var(--text-dim); }

  .swap-out-btn {
    width: 30px; height: 30px; border-radius: 50%;
    border: 1px solid var(--surface); background: var(--card);
    color: var(--accent2); font-size: 1rem; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center;
    justify-content: center; animation: fadeIn 0.3s;
  }
  .swap-out-btn:hover {
    background: var(--accent2); color: var(--bg);
    border-color: var(--accent2); transform: scale(1.15);
  }

  .slot.just-swapped { animation: swapPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  @keyframes swapPop {
    0% { transform: scale(0.5) rotateY(90deg); opacity: 0.3; }
    50% { transform: scale(1.15) rotateY(0deg); opacity: 1; }
    100% { transform: scale(1) rotateY(0deg); opacity: 1; }
  }

  .lifeline-hint { font-size: 0.72rem; color: var(--accent2); margin-top: 10px; opacity: 0.8; }
`;

export default function Mixle() {
  const seed = getDailySeed();
  const dayNum = getDayNumber();
  const allDraws = useRef(generateAllDraws(seed)).current;

  const [round, setRound] = useState(0);
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roundScored, setRoundScored] = useState(false);
  const [arranging, setArranging] = useState(false);
  const [swapsLeft, setSwapsLeft] = useState(1);
  const [swappedIndex, setSwappedIndex] = useState(null);

  // Drag state
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [ghostPos, setGhostPos] = useState(null);
  const isDragging = useRef(false);
  const dragFromRef = useRef(null);
  const dragOverRef = useRef(null);
  const lettersRef = useRef(letters);
  lettersRef.current = letters;

  const swapRng = useRef(seededRandom(seed + 99999)).current;
  const slotsContainerRef = useRef(null);

  const currentDraws = allDraws[round];
  const pickingDone = step >= 5;
  const isRoundDone = pickingDone && !arranging;
  const currentWord = letters.join("");

  // Compute reordered letters for preview
  const getReorderedLetters = useCallback(() => {
    if (dragFrom === null || dragOver === null || dragFrom === dragOver) return letters;
    const arr = [...letters];
    const [item] = arr.splice(dragFrom, 1);
    arr.splice(dragOver, 0, item);
    return arr;
  }, [letters, dragFrom, dragOver]);

  const previewWord = arranging ? getReorderedLetters().join("") : currentWord;
  const wordScore = isRoundDone ? scoreWord(currentWord) : null;
  const arrangePreview = arranging ? scoreWord(previewWord) : null;

  // Compute shift transforms for tiles during drag
  const getSlotWidth = () => {
    const c = slotsContainerRef.current;
    if (!c) return 66;
    return c.getBoundingClientRect().width / 5;
  };

  const getSlotTransform = (i) => {
    if (dragFrom === null || dragOver === null || dragFrom === dragOver) return "";
    if (i === dragFrom) return "";
    const sw = getSlotWidth();
    if (dragFrom < dragOver) {
      if (i > dragFrom && i <= dragOver) return `translateX(${-sw}px)`;
    } else {
      if (i >= dragOver && i < dragFrom) return `translateX(${sw}px)`;
    }
    return "";
  };

  // Get slot index from pointer x position
  const getSlotIndexFromX = (clientX) => {
    const c = slotsContainerRef.current;
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(4, Math.floor(x / (rect.width / 5))));
  };

  const handlePick = useCallback((letter) => {
    if (pickingDone || gameOver) return;
    const newLetters = [...letters, letter];
    setLetters(newLetters);
    const newStep = step + 1;
    setStep(newStep);
    if (newStep >= 5) setArranging(true);
  }, [pickingDone, gameOver, letters, step]);

  // --- Pointer-based drag ---
  const handlePointerDown = (e, index) => {
    if (!arranging) return;
    if (e.button && e.button !== 0) return;
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragFromRef.current = index;
    dragOverRef.current = index;
    setDragFrom(index);
    setDragOver(index);
    setGhostPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    setGhostPos({ x: e.clientX, y: e.clientY });
    const idx = getSlotIndexFromX(e.clientX);
    if (idx !== null) {
      dragOverRef.current = idx;
      setDragOver(idx);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const from = dragFromRef.current;
    const to = dragOverRef.current;
    if (from !== null && to !== null && from !== to) {
      const arr = [...lettersRef.current];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      setLetters(arr);
    }
    dragFromRef.current = null;
    dragOverRef.current = null;
    setDragFrom(null);
    setDragOver(null);
    setGhostPos(null);
  }, []);

  useEffect(() => {
    const onMove = (e) => handlePointerMove(e);
    const onUp = () => handlePointerUp();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const handleLockIn = () => {
    setArranging(false);
    setDragFrom(null);
    setDragOver(null);
    setGhostPos(null);
  };

  const handleSwapOut = (index) => {
    if (swapsLeft <= 0 || !arranging) return;
    const oldLetter = letters[index];
    let newLetter = oldLetter;
    let attempts = 0;
    while (newLetter === oldLetter && attempts < 20) {
      newLetter = pickWeightedLetter(swapRng);
      attempts++;
    }
    const newLetters = [...letters];
    newLetters[index] = newLetter;
    setLetters(newLetters);
    setSwapsLeft(0);
    setSwappedIndex(index);
    setTimeout(() => setSwappedIndex(null), 600);
  };

  const handleNextRound = () => {
    const result = { word: currentWord, score: wordScore, usedSwap: swapsLeft === 0 };
    const newResults = [...roundResults, result];
    setRoundResults(newResults);
    setRoundScored(false);
    if (round >= 2) {
      setGameOver(true);
    } else {
      setRound(round + 1);
      setStep(0);
      setLetters([]);
      setArranging(false);
      setDragFrom(null);
      setDragOver(null);
      setGhostPos(null);
      setSwapsLeft(1);
      setSwappedIndex(null);
    }
  };

  useEffect(() => {
    if (isRoundDone && !roundScored) setRoundScored(true);
  }, [isRoundDone, roundScored]);

  const bestResult = gameOver
    ? roundResults.reduce((best, r) => (r.score.total > (best?.score?.total || 0) ? r : best), null)
    : null;

  const generateShareText = () => {
    const lines = [`MIXLE #${dayNum}`];
    roundResults.forEach((r, i) => {
      const swap = r.usedSwap ? " 🔄" : "";
      if (r.score.valid) {
        lines.push(`R${i+1}: 🟩🟩🟩🟩🟩 ${r.word.toUpperCase()} — ${r.score.total}pts${swap}`);
      } else {
        lines.push(`R${i+1}: 🟨🟨⬜⬜⬜ (no word)${swap}`);
      }
    });
    lines.push(`Best: ${Math.max(...roundResults.map(r => r.score.total))}pts`);
    lines.push("www.mixle.fun");
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="logo">Mixle</div>
          <div className="subhead">Mix your letters. Make your word.</div>
        </div>

        {!gameOver ? (
          <>
            <div className="round-indicator">
              {[0,1,2].map(i => (
                <div key={i} className={`round-dot ${i === round ? 'active' : ''} ${i < round ? 'done' : ''}`} />
              ))}
            </div>
            <div className="round-label">Round {round + 1} of 3</div>

            {/* Word slots */}
            <div className="word-slots" ref={slotsContainerRef}>
              {[0,1,2,3,4].map(i => (
                <div key={i} className="slot-column"
                  style={{
                    transform: getSlotTransform(i),
                    transition: dragFrom !== null ? 'transform 0.2s cubic-bezier(0.2,0,0,1)' : 'none'
                  }}
                >
                  <div
                    className={`slot ${i < letters.length ? 'filled' : ''} ${i === step && !pickingDone ? 'current' : ''} ${isRoundDone ? (wordScore.valid ? 'valid-word' : 'invalid-word') : ''} ${arranging ? 'arrange-mode' : ''} ${dragFrom === i ? 'dragging-src' : ''} ${arranging && dragFrom === null && arrangePreview?.valid ? 'valid-preview' : ''} ${swappedIndex === i ? 'just-swapped' : ''}`}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    style={arranging ? { touchAction: 'none' } : {}}
                  >
                    {letters[i] || ""}
                  </div>
                  {arranging && swapsLeft > 0 && dragFrom === null && (
                    <button className="swap-out-btn"
                      onClick={(e) => { e.stopPropagation(); handleSwapOut(i); }}
                    >↻</button>
                  )}
                </div>
              ))}
            </div>

            {/* Ghost tile that follows the pointer */}
            {ghostPos && dragFrom !== null && (
              <div className="ghost-tile" style={{ left: ghostPos.x, top: ghostPos.y }}>
                {letters[dragFrom]}
              </div>
            )}

            {/* Choices, Arrange, or Score */}
            {!pickingDone ? (
              <div className="choices-area">
                <div className="choices-label">Pick a letter ({step + 1} of 5)</div>
                <div className="choices">
                  {currentDraws[step].map((l, i) => (
                    <div className="choice-wrapper" key={i}>
                      <button className="choice-btn" onClick={() => handlePick(l)}>{l}</button>
                      <span className="point-badge">{LETTER_VALUES[l]}pt</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : arranging ? (
              <div className="arrange-area">
                <div className="arrange-label">Drag letters to rearrange</div>
                <div className="arrange-status">
                  {arrangePreview?.valid
                    ? <span className="arrange-valid">✓ {previewWord.toUpperCase()} is a word! ({arrangePreview.total}pts)</span>
                    : <span className="arrange-invalid">✗ {previewWord.toUpperCase()} — not a word yet</span>
                  }
                </div>
                {swapsLeft > 0 && (
                  <div className="lifeline-hint">↻ 1 letter swap available — tap ↻ under a letter to replace it</div>
                )}
                <button className="next-btn" onClick={handleLockIn} style={{ marginTop: 12 }}>Lock It In</button>
              </div>
            ) : (
              <div className="score-area">
                <div className="score-row">
                  <span className="label">Word</span>
                  <span className="value" style={{ textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
                    {currentWord} {wordScore.valid ? "✓" : "✗"}
                  </span>
                </div>
                {wordScore.valid ? (
                  <>
                    <div className="score-row"><span className="label">Letter points</span><span className="value">{wordScore.letterScore}</span></div>
                    <div className="score-row"><span className="label">Word bonus</span><span className="value">+{wordScore.wordBonus}</span></div>
                    <div className="score-row" style={{ borderTop: "1px solid var(--surface)", paddingTop: 10, marginTop: 4 }}>
                      <span className="label">Total</span><span className="value big">{wordScore.total}</span>
                    </div>
                  </>
                ) : (
                  <div className="score-row">
                    <span className="label" style={{ color: "var(--accent)" }}>Not a valid word — 0 pts</span>
                  </div>
                )}
                <button className="next-btn" onClick={handleNextRound} style={{ marginTop: 16 }}>
                  {round < 2 ? "Next Round →" : "See Results"}
                </button>
              </div>
            )}

            {roundResults.length > 0 && (
              <div className="round-scores">
                {roundResults.map((r, i) => (
                  <div key={i} className="round-score-card">
                    <div className="rd-label">Round {i+1}</div>
                    <div className="rd-word">{r.word}</div>
                    {r.score.valid ? <div className="rd-score">{r.score.total}pts</div> : <div className="rd-invalid">No word</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="result-title">{bestResult?.score?.valid ? "Nice Build!" : "Tough Letters!"}</div>
            <div className="result-sub">MIXLE #{dayNum}</div>
            <div className="round-scores">
              {roundResults.map((r, i) => {
                const isBest = bestResult && r.word === bestResult.word && r.score.total === bestResult.score.total;
                return (
                  <div key={i} className={`round-score-card ${isBest ? 'best' : ''}`}>
                    <div className="rd-label">Round {i+1}</div>
                    <div className="rd-word">{r.word.toUpperCase()}{r.usedSwap ? " 🔄" : ""}</div>
                    {r.score.valid ? <div className="rd-score">{r.score.total}pts</div> : <div className="rd-invalid">No word</div>}
                  </div>
                );
              })}
            </div>
            <div className="share-preview">{generateShareText()}</div>
            <button className="share-btn" onClick={handleShare}>📋 Copy Results to Share</button>
            {copied && <div className="copied-toast">Copied to clipboard!</div>}
          </>
        )}

        <div className="how-to-play">
          <button className="how-btn" onClick={() => setShowHelp(true)}>How to Play</button>
        </div>

        {showHelp && (
          <div className="modal-overlay" onClick={() => setShowHelp(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>How to Play</h2>
              <div className="step-row"><span className="step-num">1</span><p>Each turn, pick one letter from 4 options. Every draw has at least one vowel.</p></div>
              <div className="step-row"><span className="step-num">2</span><p>After picking all 5 letters, <strong>drag to rearrange</strong> them into the best word you can.</p></div>
              <div className="step-row"><span className="step-num">3</span><p><strong>Stuck?</strong> You get 1 letter swap per round — tap ↻ under any letter to replace it with a new random one.</p></div>
              <div className="step-row"><span className="step-num">4</span><p>You get <strong>3 rounds</strong> with different letter draws. Your best round is your score.</p></div>
              <div className="step-row"><span className="step-num">5</span><p>Valid words score points based on letter rarity (like Scrabble tiles). Rarer letters = more points!</p></div>
              <div className="step-row"><span className="step-num">6</span><p>Everyone gets the same draws each day. Share your score and compare!</p></div>
              <button className="close-btn" onClick={() => setShowHelp(false)}>Got it!</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
