from typing import Any, Iterator, TypeAlias
from unittest import mock

import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from .main import app, init_state

ndarray: TypeAlias = np.ndarray[int, np.dtype[np.float32]]


@pytest.fixture
def pil_image() -> Image.Image:
    return Image.new("RGB", (600, 800))


@pytest.fixture
def cv_image(pil_image: Image.Image) -> ndarray:
    return np.asarray(pil_image)[:, :, ::-1]  # PIL uses RGB while cv2 uses BGR


@pytest.fixture
def mock_get_model() -> Iterator[mock.Mock]:
    with mock.patch("app.models.cache.InferenceModel.from_model_type", autospec=True) as mocked:
        yield mocked


@pytest.fixture(scope="session")
def deployed_app() -> TestClient:
    init_state()
    return TestClient(app)


@pytest.fixture(scope="session")
def tag_response() -> list[str]:
    return [
        "matchstick",
        "nematode",
        "nematode worm",
        "roundworm",
        "theater curtain",
        "theatre curtain",
        "spotlight",
        "spot",
        "digital clock",
    ]


@pytest.fixture(scope="session")
def clip_image_response() -> list[float]:
    # fmt: off
    return [-0.1503497064113617, -0.26338839530944824, -0.5655120611190796, -0.07222450524568558, 0.1557869017124176, -0.04308490827679634, -0.3871212303638458, 1.2720786333084106, 0.28359371423721313, 0.2737857401371002, 0.5060482025146484, -0.1557128131389618, 0.3533468246459961, 0.01474827527999878, -0.1428389996290207, 0.11168161034584045, 0.10963180661201477, 0.1525699496269226, 0.03198016434907913, 0.37112998962402344, 0.3841392397880554, 0.1560487300157547, -0.08011418581008911, -0.0414440855383873, -0.11277894675731659, -0.19827546179294586, -0.4201951026916504, -0.047886259853839874, 0.35359475016593933, -0.32785624265670776, -0.18916064500808716, 0.16513843834400177, -0.28110021352767944, -0.02913704514503479, -0.5625120401382446, -0.27407437562942505, 0.1405377984046936, -0.18804830312728882, 0.05606943368911743, -1.8098962306976318, -0.30152440071105957, 0.36267736554145813, -0.1972821056842804, 0.4708936810493469, -0.2627987265586853, 0.17974340915679932, -0.23960985243320465, -0.12328865379095078, -0.09735478460788727, -0.23208953440189362, -0.11159719526767731, -0.40541020035743713, 0.3979860842227936, 0.03492492437362671, 0.1079457551240921, 0.12264229357242584, 0.19060258567333221, -0.06760812550783157, -0.14953204989433289, 0.020657464861869812, -0.045544713735580444, -0.49547797441482544, 0.16501721739768982, 0.409220427274704, 0.025506392121315002, -0.07141813635826111, -0.08364877104759216, -0.402360737323761, 0.01254647970199585, -0.3270309269428253, -0.5074016451835632, -0.14843346178531647, 0.2588506042957306, 0.19633343815803528, -0.3371100425720215, -0.20139610767364502, 0.1256970763206482, 0.2077842354774475, 0.01762661337852478, -0.09415242820978165, -0.06982693821191788, 0.05645954608917236, 0.2230844497680664, -0.3787960410118103, 0.2884414792060852, 0.15585792064666748, 0.2103164792060852, 0.5253552794456482, 0.11847981810569763, -0.4132201671600342, -0.340353399515152, 0.08250808715820312, -9.104710578918457, 0.5367923974990845, 0.3082265555858612, -0.054788097739219666, 0.38076674938201904, 0.10743528604507446, -0.4294043183326721, -0.6330970525741577, -0.2239609658718109, 0.14761009812355042, 0.10569937527179718, -0.03754069656133652, -0.13122299313545227, 0.052014321088790894, -1.317906141281128, 0.3992273807525635, 0.33764201402664185, -0.1352805197238922, -0.05533941090106964, -0.12124986946582794, -0.21593835949897766, -0.18228507041931152, -0.22175437211990356, -0.3678016662597656, -0.1543227732181549, -0.22483907639980316, -0.19485993683338165, 0.6772430539131165, -0.38898220658302307, 0.05267711728811264, -0.1736181378364563, 0.09440051019191742, 0.05043143033981323, -0.08631592988967896, -0.27284130454063416, -0.06817375123500824, 0.17827574908733368, 0.23594903945922852, 0.0936334878206253, 0.2405415028333664, -0.03946849703788757, 1.2118183374404907, 0.09601867198944092, 0.3550981879234314, -0.2727612555027008, -0.18505775928497314, -0.09403584897518158, -0.047489557415246964, 0.18727253377437592, -0.6417330503463745, 0.15188869833946228, 0.39904549717903137, -0.3706473708152771, 0.30436980724334717, -0.20777952671051025, 0.21207189559936523, 0.15178178250789642, 0.08812069892883301, 0.07701482623815536, -0.015871748328208923, 0.4365525543689728, 0.07790355384349823, 0.41923996806144714, 0.04688695818185806, 0.11905840039253235, -0.009424615651369095, -0.11237604916095734, 0.233009934425354, -0.1393250972032547, -0.13983336091041565, 0.0062601566314697266, -0.17631873488426208, 0.2863244414329529, 0.2513056695461273, -0.18979927897453308, -0.1352718472480774, 0.20460893213748932, -0.12186478078365326, -0.09860621392726898, -0.008292056620121002, 0.1744387447834015, -0.04108913987874985, 0.21673311293125153, -0.12838992476463318, -0.14950336515903473, -0.11025911569595337, -0.050624407827854156, 0.09065848588943481, 0.12539921700954437, 0.06310015916824341, -0.03992995619773865, 0.11594507843255997, -0.0679289698600769, -0.3390244245529175, 0.37619641423225403, -0.08030971884727478, -0.16285991668701172, 0.09049184620380402, 0.19502219557762146, -0.2555782198905945, -0.3483888506889343, 0.17943069338798523, 0.4208906292915344, -0.21696600317955017, 0.09876695275306702, 0.24968630075454712, -0.25556057691574097, 0.08045558631420135, 0.1918676197528839, -0.0391634926199913, 0.2760481834411621, -0.052914783358573914, 0.2551308572292328, -0.17824983596801758, -0.10600590705871582, -0.07306042313575745, 0.5268251299858093, 0.3004921078681946, 0.11021347343921661, 0.6560711860656738, 0.3629128336906433, -0.20159263908863068, 0.3353482186794281, 0.16813652217388153, 0.3684561848640442, 0.2572426199913025, -0.1394597291946411, -0.1081065982580185, 0.3119319677352905, 0.1547945886850357, -0.1011475920677185, 0.12471853196620941, 0.05174969136714935, 0.11287996917963028, 0.13873223960399628, -0.08381669968366623, 0.08320209383964539, 0.0005587935447692871, -0.1399155706167221, 0.26964786648750305, -0.10338637977838516, -0.635022759437561, 0.07535472512245178, 0.38028770685195923, -0.08784236013889313, 0.012145690619945526, -0.4892919957637787, -0.33344197273254395, 0.2501947581768036, 0.3406282663345337, -0.29875123500823975, 0.10239893198013306, -0.4501486122608185, -0.5407907962799072, 0.02152668684720993, -0.10010775923728943, 0.3343956470489502, 0.043100178241729736, -0.28547170758247375, -0.2451920360326767, 0.11399783194065094, -0.06306293606758118, 0.0514407679438591, 0.1943231225013733, -0.0092984139919281, -0.25484439730644226, -0.16108255088329315, -0.07067693769931793, -0.00940198078751564, -0.4148368835449219, -0.033262044191360474, 0.4516279101371765, -0.24985359609127045, 0.20121824741363525, 0.4106118083000183, -0.5621019005775452, 0.046541422605514526, 0.11314355581998825, 0.3270842730998993, 0.2676352858543396, 0.12272027134895325, 0.23055218160152435, -0.3493749797344208, 0.10709720849990845, 0.44768550992012024, -0.04293309152126312, -0.03936107084155083, 0.2270624190568924, 0.16066348552703857, 0.35009339451789856, 0.04158636927604675, 0.03541511297225952, -0.11349448561668396, 0.03199382871389389, -0.0008175931870937347, -0.317646861076355, 0.025708124041557312, -0.3693602383136749, 0.5752753019332886, 0.34967079758644104, -0.46220043301582336, 0.356049120426178, -0.07281075417995453, 0.3589980900287628, -0.2318757176399231, -0.13105618953704834, 0.2065689116716385, -0.06275947391986847, 0.2042674571275711, -0.4130946397781372, -0.1220964565873146, 0.5112582445144653, -0.3460087478160858, -0.8238317966461182, 0.14678490161895752, 0.04015420377254486, -0.006557643413543701, -0.18147070705890656, -0.29465460777282715, 0.2962910532951355, 1.2113488912582397, -0.14589866995811462, 0.01400098204612732, 0.5417146682739258, 0.24798265099525452, 0.07022618502378464, 0.16047419607639313, 0.19315579533576965, 0.046383827924728394, 1.2587014436721802, 0.13661745190620422, 0.15565162897109985, 0.12895506620407104, 0.257668673992157, -0.2156587839126587, 0.24780665338039398, 0.1337527483701706, 1.296618938446045, -0.012920260429382324, 0.21750850975513458, 0.020899254828691483, -0.4345206022262573, 0.23699785768985748, -0.057529620826244354, -0.1588137149810791, 0.2551633417606354, 0.22220531105995178, 0.3276950418949127, -0.2745910882949829, 0.03471551090478897, 0.3112860321998596, 0.2810869812965393, 0.2718833386898041, 0.01436258852481842, 0.21428215503692627, -0.17697292566299438, 0.17256298661231995, -0.22692933678627014, 0.5784951448440552, -0.025022784247994423, 0.4769775867462158, -0.08030113577842712, -0.1672212779521942, -0.6855964064598083, -0.41609156131744385, -0.26269420981407166, -0.07503907382488251, 0.19233737885951996, -0.06759896874427795, -0.09529343247413635, 0.09245525300502777, 0.08412420749664307, -0.606180727481842, -0.42773720622062683, 0.17781633138656616, -0.014700733125209808, 0.1649937480688095, 0.06545217335224152, 0.056644488126039505, -0.282379686832428, 0.13707347214221954, 0.20983807742595673, 0.22233684360980988, 0.22664642333984375, -0.007336974143981934, -0.017350323498249054, -0.5800395011901855, -0.3650877773761749, -0.43565335869789124, -0.11023098230361938, 0.14169475436210632, -0.2186550498008728, 0.08632096648216248, -0.2775184214115143, 0.16572964191436768, -0.054821647703647614, 0.012959688901901245, 0.10601806640625, -0.5677923560142517, -0.07860828936100006, -0.11558187007904053, -0.2668137848377228, 0.37440529465675354, 0.2550721764564514, 0.4321855306625366, -0.17515484988689423, -0.7251265048980713, -0.09783211350440979, 0.03180219605565071, 0.017610028386116028, 0.4321219027042389, 0.10047803819179535, -0.20737037062644958, -0.029400426894426346, 0.16525790095329285, 0.03198770433664322, 0.8583027124404907, -0.2614802122116089, -0.33115634322166443, 0.10226110368967056, 0.12969331443309784, 0.0962774008512497, 0.1938648819923401, 0.019921928644180298, -0.24156862497329712, -0.07179004698991776, 0.12483114004135132, -0.11993065476417542, 0.17780695855617523, -0.3194235563278198, 0.2734241485595703, -0.5535119771957397, 0.29743289947509766, 0.05474330484867096, -0.18467886745929718, 0.08001690357923508, -0.5903282761573792, -0.0422833077609539, -0.11614792048931122, -0.2760723829269409, 0.04588329792022705, 0.024796903133392334, 0.0228412002325058, -0.10622230172157288, -0.0740782767534256, -0.012539714574813843, -0.14146174490451813, -0.06914753466844559, -0.007321890443563461, 0.35990434885025024, 0.173700213432312, -0.1448882520198822, -0.06778709590435028, 0.06621548533439636, -0.26644161343574524, -0.04929056763648987, -0.12463732063770294, -0.1825450360774994, -0.050098665058612823, -0.34152570366859436, -0.04286198690533638, -0.34003931283950806, 0.2556508779525757, -0.017066851258277893, -0.2992037534713745, -0.49942725896835327, 0.18731364607810974, -0.2803362011909485, 0.2351609766483307, 0.04899322986602783, -0.23118168115615845, -0.020409684628248215, 0.4137369692325592, 0.041882023215293884, 0.8543367385864258, -0.0407162606716156, 0.055834680795669556, -0.3278890550136566, -0.2651934027671814, 0.42500773072242737, -0.007330574095249176, -0.34944894909858704, -0.05894789099693298, -0.11741754412651062, 0.32538557052612305, -0.09227307885885239, -0.2109876275062561, 0.32647180557250977, -0.0870003029704094, -0.10214601457118988, 0.03182033449411392, 0.7124476432800293, -0.18646913766860962, -0.30009108781814575, 0.6758496761322021, -0.15808522701263428, 0.06233774125576019, -0.37928515672683716, 0.1257198303937912, 0.09383836388587952, 0.03652769327163696, 0.28418007493019104, 0.10384587943553925, -0.3028501868247986, 0.3513643443584442, -0.16712747514247894, -0.27849292755126953, -0.42919832468032837, -0.1720525026321411, -0.18900787830352783, -0.07925420254468918, 0.15841886401176453, 0.6488138437271118, 0.09101241081953049, -0.02837720513343811, -0.3493013381958008, -0.13481371104717255, 0.7722870111465454, -0.3643395006656647, -0.29339152574539185]
    # fmt: on


@pytest.fixture(scope="session")
def clip_text_response() -> list[float]:
    # fmt: off
    return [-0.051369935274124146, -0.010725006461143494, -0.11009600013494492, -0.08671483397483826, -0.1376112848520279, 0.1834997683763504, -0.13518013060092926, -1.2175710201263428, 0.21137484908103943, -0.18747025728225708, -0.04556228220462799, 0.2627124488353729, 0.026277093216776848, 0.022868335247039795, 0.3758852779865265, -0.050838619470596313, 0.29562997817993164, 0.20151537656784058, -0.02015306055545807, 0.17147132754325867, 0.14357797801494598, -0.08850984275341034, 0.02603408694267273, -0.2109367996454239, -0.08127906918525696, 0.1460433006286621, -0.1448330283164978, 0.19058109819889069, -0.16784363985061646, 0.05917847529053688, -0.08631782233715057, -0.16270577907562256, 0.16088467836380005, 0.07714083790779114, 0.03789868205785751, 0.1956929862499237, 0.0517326295375824, -0.005512930452823639, 0.047351937741041183, -0.1909642219543457, 0.010126054286956787, -0.27198368310928345, -0.08384807407855988, 0.19902220368385315, -0.03116871416568756, -0.06306224316358566, -0.13961419463157654, 0.0525326132774353, -0.008902296423912048, 0.04049867391586304, -0.0951114073395729, -0.10472963750362396, 0.15850012004375458, 0.24902492761611938, 0.26900243759155273, 0.09727084636688232, 0.01945263147354126, 0.005587100982666016, -0.0347808301448822, 0.3930657207965851, 0.22567930817604065, -0.2227778136730194, 0.051797881722450256, -0.14941716194152832, 0.06470682471990585, -0.09520977735519409, -0.07954283058643341, 0.13018378615379333, 0.25618842244148254, -0.25645968317985535, 0.060703642666339874, -0.14322586357593536, -0.18528185784816742, 0.06203678250312805, -0.03347042202949524, -0.0051424503326416016, -0.5088537335395813, -0.1840534806251526, 0.1848325878381729, 0.052688274532556534, -0.1965670883655548, -0.20634984970092773, 0.04999275505542755, 0.2836085557937622, 0.07079711556434631, 0.44851911067962646, 0.1325448453426361, -0.41299372911453247, 0.3724905252456665, -0.14482314884662628, -0.16094544529914856, 0.0793130099773407, -2.0048556327819824, 0.3593715727329254, 0.0009432807564735413, 0.09033863246440887, -0.13612447679042816, 0.20753170549869537, 0.056115202605724335, -0.13530956208705902, 0.20019665360450745, 0.20947805047035217, 0.011267989873886108, -0.09066569805145264, -0.0007635504007339478, 0.0008731484413146973, -0.44167017936706543, -0.3381350040435791, 0.06586254388093948, -0.16046567261219025, 0.13803477585315704, 0.22680139541625977, 0.06841648370027542, -0.04588864743709564, -0.15522271394729614, -0.2671688497066498, -0.20172488689422607, -0.11681345105171204, -0.2891874313354492, 0.10894495993852615, 0.016581878066062927, 0.08065705746412277, 0.03441505879163742, -0.040672171860933304, 0.23110319674015045, -0.037525858730077744, -0.08831262588500977, -0.08008699119091034, 0.09568070620298386, 0.18096476793289185, 0.06148066371679306, -0.367189884185791, -0.185734823346138, 7.826099395751953, -0.13802570104599, 0.2800956070423126, -0.22982153296470642, -0.09386709332466125, -0.15627573430538177, 0.037662118673324585, -0.13656215369701385, -0.07198184728622437, -0.322614461183548, -0.006186550483107567, -0.46435683965682983, 0.12803569436073303, -0.11408974975347519, -0.006137289106845856, -0.14130638539791107, -0.07269007712602615, -0.02471087872982025, -0.01719208061695099, 0.04794128239154816, 0.015703098848462105, -0.011346891522407532, -0.2799241840839386, 0.04372157156467438, 0.1896992325782776, -0.13235250115394592, 0.2291410267353058, -0.1392405480146408, -0.34844085574150085, -0.12091708183288574, -0.06026161462068558, -0.013828547671437263, 0.11202779412269592, 0.277866005897522, -0.4359501302242279, -0.06519348919391632, -0.008573257364332676, -0.14178775250911713, -0.11654964089393616, 0.27719753980636597, -0.017636612057685852, 0.05240386724472046, -0.32324519753456116, 0.0938805490732193, 0.004964321851730347, 0.32904016971588135, 0.08840127289295197, -0.22231429815292358, 0.1611260622739792, -0.25504690408706665, 0.3107917904853821, -0.15648266673088074, -0.14989043772220612, 0.14963313937187195, 0.23006673157215118, 0.2181217074394226, -0.21481798589229584, 0.01277482882142067, -0.5298252105712891, -0.38569486141204834, -0.15905818343162537, 0.38914966583251953, -0.05173046141862869, 0.016740625724196434, -0.016509413719177246, -0.250088095664978, -0.18937590718269348, 0.4233970642089844, -0.18640199303627014, -0.36222168803215027, 0.13211572170257568, -0.12458311021327972, -0.17373305559158325, -0.012691006064414978, 0.2151109278202057, 0.07149481773376465, -0.3380594253540039, 0.23961129784584045, 0.17417001724243164, 0.21425491571426392, -0.3403988480567932, -0.18938428163528442, 0.26312142610549927, -0.18937340378761292, -0.2695082128047943, 0.3464704751968384, -0.026021957397460938, 0.16364264488220215, -0.18288151919841766, 0.04950743168592453, 0.1870364248752594, 0.05565011501312256, 0.04865076020359993, 0.15473288297653198, 0.07724197208881378, -0.08260702341794968, -0.23326924443244934, 0.39012813568115234, 0.30722934007644653, -0.2548608183860779, -0.10277849435806274, 0.31726837158203125, -0.04298326373100281, -0.24891462922096252, -0.041203320026397705, -0.10855470597743988, -0.0399850457906723, 0.016369149088859558, 0.2801763117313385, 0.22338557243347168, -0.2106330692768097, -0.19607603549957275, 0.40184202790260315, 0.013695113360881805, -0.024221263825893402, 0.44003885984420776, -0.10847768187522888, -0.24203643202781677, 0.26467961072921753, -0.05966983735561371, 0.12467685341835022, -0.21156349778175354, 0.3611948788166046, 0.04894602298736572, -0.09056273102760315, 0.01707540452480316, 0.076592355966568, 0.027092672884464264, -0.41262251138687134, 0.13822166621685028, 0.09504467248916626, 0.002575445920228958, -0.3847529888153076, 0.18197567760944366, 0.2379690706729889, -0.05150367692112923, 0.2653059959411621, -0.15765774250030518, 0.1880730241537094, 0.021861106157302856, -0.11092785745859146, 0.08940362930297852, 0.3101727366447449, 0.014927387237548828, -0.2911876440048218, -0.16078510880470276, -0.06823819875717163, 0.19686979055404663, 0.2373345047235489, 0.08917825669050217, 0.060556091368198395, 0.017128556966781616, 0.04221831634640694, 0.07160300761461258, 0.114939846098423, 0.07517443597316742, 0.1443810611963272, -0.060701385140419006, 0.09209010750055313, -0.01475987583398819, -0.0017274729907512665, -0.06395074725151062, -0.13522477447986603, -0.3005772829055786, -0.25623619556427, 0.012192284688353539, 0.17816416919231415, -0.08423683047294617, 0.1499529331922531, -0.0016323104500770569, -0.3038976788520813, -0.011781338602304459, 0.17713011801242828, 0.2583661377429962, -0.21670076251029968, -0.1923849880695343, -0.21187667548656464, -0.027309250086545944, -0.07633239030838013, 7.819303512573242, 0.16145764291286469, -0.30060699582099915, -0.1365492194890976, -0.0063630640506744385, -0.1362326741218567, -0.16472479701042175, 0.17343278229236603, 0.24356240034103394, 0.6252191066741943, -0.09942090511322021, -0.18946921825408936, -0.3351835608482361, 0.35568395256996155, 0.11762797087430954, -0.3656516671180725, 0.19118718802928925, -3.4465088844299316, 0.22562159597873688, -0.2150695025920868, -0.06499379128217697, 0.046910446137189865, -0.05743652582168579, -0.33147257566452026, 0.2564307153224945, 0.09259609133005142, -0.08864793181419373, -0.11425864696502686, -0.19367149472236633, -0.06630873680114746, -0.007083814591169357, -0.05304165184497833, 0.2017112821340561, 0.10328061133623123, -0.04912707582116127, -0.060788594186306, 0.0784585103392601, 0.28052055835723877, -0.33164721727371216, 0.017689572647213936, -0.001561986282467842, 0.39189884066581726, -0.12148138135671616, 0.1046065166592598, 0.021570973098278046, -0.012959085404872894, 0.2276451140642166, -0.15909601747989655, 0.09318748116493225, 0.03624418377876282, 0.41286107897758484, 0.4439883232116699, -0.574947714805603, 0.2063872516155243, -0.11515115946531296, 0.15398114919662476, -0.10527925938367844, 0.08131930232048035, -0.10869307070970535, -0.012484684586524963, 0.12625205516815186, 0.2636316418647766, -0.07193168997764587, 0.08365315198898315, 0.07778038084506989, -0.08492550998926163, -0.31494593620300293, -0.30747660994529724, -0.12434972077608109, -0.14759579300880432, -0.0856187641620636, -0.015103459358215332, 0.21642933785915375, 0.24999216198921204, -0.25810444355010986, -0.10437635332345963, -0.09068337082862854, 0.015814702957868576, -0.13024312257766724, -0.031961895525455475, -0.050593845546245575, 0.47274336218833923, -0.24634651839733124, 0.2797456383705139, -0.2669164538383484, -0.18765005469322205, -0.12668517231941223, -0.07038992643356323, -0.15561681985855103, 0.16797593235969543, 0.08408385515213013, 0.05721508711576462, 0.055883586406707764, 0.07930487394332886, 0.06364040076732635, 0.2569333016872406, 0.14447829127311707, -0.051580414175987244, 0.06861788034439087, 0.02721872180700302, 0.06561324000358582, 0.12471484392881393, 0.1832738071680069, -0.16585436463356018, -0.08117838203907013, -0.06088650971651077, -0.2081316113471985, 0.1322343945503235, 0.01742127537727356, -0.17162840068340302, 0.0042439959943294525, -0.13668203353881836, -0.07343199849128723, 0.2740647494792938, 0.1601387858390808, -0.12330605089664459, -0.3267219662666321, -0.3382628858089447, 0.3690100908279419, 0.18473923206329346, -0.17084713280200958, -0.05962555855512619, -0.0792207270860672, -0.06036840379238129, -0.3774709701538086, -0.05851760879158974, 0.3206423819065094, 0.0651409924030304, -0.058551669120788574, -0.36781901121139526, -0.24176156520843506, -0.4543174207210541, -0.08731119334697723, -0.045513980090618134, -0.01741885021328926, 0.034853145480155945, -0.03033122420310974, -0.5135809183120728, -0.3117552399635315, 0.11883510649204254, 0.03182804584503174, 0.304332971572876, -0.018284954130649567, 0.00013580918312072754, -0.30424895882606506, 0.14760465919971466, -0.21293771266937256, 0.23776817321777344, -0.24130550026893616, 0.05505291372537613, 0.0050969719886779785, -0.02879290282726288, 0.030616000294685364, -0.05236539989709854, 0.0355415940284729, -0.10839346051216125, -0.15302366018295288, 0.17155241966247559, 0.024070631712675095, 0.09996841847896576, 0.3937240242958069, 0.11562097072601318, -0.03887242078781128, 0.08371567726135254, -0.034323759377002716, -0.15314003825187683, 0.21605932712554932, 0.2662332057952881, 0.01804041489958763, -1.175376534461975, -0.04393252357840538, 0.1724747121334076, 0.17443567514419556, -0.03206155076622963, -0.023589134216308594, 0.0018865615129470825, 0.195848286151886, 0.10615190118551254, -0.04240237921476364, -0.1930321455001831, -0.4515952467918396, 0.06612616777420044, -0.23157468438148499, -0.5452786087989807, 0.20692341029644012, -0.0644945502281189, 0.29818546772003174, 0.4354862868785858, 0.05778267979621887, -0.0014227330684661865, 0.07666969299316406, 0.026816070079803467, 0.24234911799430847, 0.24426233768463135, -0.06976135820150375, -0.002162843942642212, 0.040565088391304016, 0.12837275862693787, -0.28299012780189514, 0.33027389645576477]
    # fmt: on


@pytest.fixture(scope="session")
def face_response() -> list[dict[str, Any]]:
    return [
        {
            "imageWidth": 600,
            "imageHeight": 800,
            "boundingBox": {"x1": 690.0, "y1": -89.0, "x2": 833.0, "y2": 96.0},
            "score": 0.03575617074966431,
            # fmt: off
            "embedding": [-0.43665632605552673, -0.5930537581443787, -0.12699729204177856, 0.3985028862953186, 0.18789690732955933, -0.25987985730171204, 0.14818175137043, -0.5422291159629822, -0.0671021044254303, -0.1319030374288559, 0.056408628821372986, 0.046094197779893875, -0.14984919130802155, 0.04322558641433716, 0.023826055228710175, -0.09063439071178436, 0.07891753315925598, -0.2935708165168762, -0.6277135014533997, -0.2904231548309326, 0.18039005994796753, 0.21837681531906128, 0.17909450829029083, -0.04030478745698929, -0.03556056320667267, -0.07568575441837311, 0.12771207094192505, -0.13466131687164307, -0.23686951398849487, 0.36429697275161743, 0.2955845892429352, 0.2086743414402008, 0.11252538859844208, 0.4769151210784912, -0.05477480590343475, 0.030100278556346893, -0.049531325697898865, 0.040458545088768005, 0.23517772555351257, 0.17130395770072937, 0.17269372940063477, 0.08591301739215851, 0.046999648213386536, -0.17151862382888794, -0.24437746405601501, 0.31105315685272217, -0.23971444368362427, -0.3174452781677246, -0.026422448456287384, -0.26203349232673645, -0.1855347454547882, -0.3104425370693207, 0.6385250091552734, 0.2749706506729126, 0.006675023585557938, 0.05378580465912819, -0.20257888734340668, -0.4839984178543091, 0.2170865386724472, -0.4781228303909302, -0.12367318570613861, -0.09901124238967896, 0.1863373965024948, 0.3114345669746399, -0.12165745347738266, 0.13010038435459137, 0.1253461092710495, 0.10728863626718521, 0.3747178912162781, -0.12302650511264801, -0.1263274848461151, -0.1562153398990631, 0.260276198387146, 0.15841349959373474, 0.5164251327514648, -0.31015825271606445, 0.24754373729228973, 0.10240863263607025, -0.11818322539329529, -0.14073267579078674, 0.027111530303955078, 0.09927573800086975, -0.10066951811313629, 0.4808421730995178, -0.042361728847026825, -0.08512216061353683, 0.1369529813528061, 0.3037898540496826, 0.11138055473566055, -0.3182139992713928, -0.5708587169647217, -0.14786981046199799, 0.49985525012016296, -0.23231984674930573, 0.13856683671474457, -0.5383139848709106, -0.05995427444577217, 0.2796868085861206, -0.3244798481464386, 0.16510958969593048, 0.5714607834815979, -0.1512063443660736, 0.20110568404197693, -0.49805426597595215, -0.20088790357112885, -0.046678103506565094, 0.2465328425168991, 0.02250899374485016, -0.1409173160791397, 0.3807566463947296, 0.3381146490573883, 0.05011143907904625, -0.23718394339084625, -0.20052078366279602, -0.1408103108406067, -0.34221047163009644, 0.11998140811920166, 0.24424004554748535, 0.1376989781856537, -0.25339990854263306, -0.4108094573020935, -0.28673601150512695, -0.20673272013664246, 0.46043485403060913, 0.4178845286369324, 0.10520245134830475, -0.14469142258167267, 0.08073662221431732, -0.3737245798110962, 0.13030850887298584, -0.08456054329872131, 0.21937909722328186, -0.2270081490278244, 0.3039504289627075, 0.009785190224647522, -0.07245694845914841, 0.5029141306877136, -0.24968916177749634, 0.31788119673728943, 0.12665590643882751, -0.0364842563867569, 0.21702805161476135, -0.09277956187725067, 0.17766769230365753, -0.1201881617307663, 0.008044496178627014, -0.26986125111579895, 0.29888248443603516, -0.2848595380783081, 0.30066442489624023, -0.14317002892494202, 0.5380052328109741, 0.03084031492471695, 0.023038823157548904, 0.7386217713356018, 0.003468744456768036, 0.23797431588172913, -0.11183349043130875, 0.0678468644618988, -0.23546601831912994, 0.3935474753379822, 0.005377739667892456, 0.13494043052196503, 0.1370638608932495, -0.02944491058588028, 0.14705342054367065, -0.4812065362930298, 0.27262356877326965, -0.05196662247180939, -0.3097267150878906, 0.08714988827705383, 0.10841232538223267, -0.11757145822048187, -0.5010467767715454, -0.32369980216026306, -0.21964779496192932, -0.19810467958450317, 0.14780977368354797, -0.04624304920434952, 0.24638010561466217, -0.0671030580997467, -0.31719157099723816, 0.269559383392334, 0.37117093801498413, -0.3964727520942688, 0.21541666984558105, -0.12243526428937912, -0.5392556190490723, 0.0464024543762207, 0.3657010495662689, -0.042127206921577454, -0.03063909336924553, 0.2190942019224167, 0.16005609929561615, -0.03320079296827316, -0.0949995294213295, 0.33176088333129883, 0.2253836989402771, -0.016216054558753967, -0.4241701662540436, 0.5294063091278076, -0.011592432856559753, -0.21875163912773132, -0.06394624710083008, 0.24449443817138672, -0.056584421545267105, -0.09727923572063446, -0.3978732228279114, -0.11175088584423065, 0.08514271676540375, -0.05761905014514923, -0.049855880439281464, 0.17287252843379974, 0.41813868284225464, -0.3043341636657715, 0.308758020401001, -0.6604494452476501, -0.13869403302669525, 0.07291632890701294, -0.0432523638010025, 0.3740164041519165, 0.17014223337173462, -0.2646957337856293, -0.346534788608551, 0.13010692596435547, 0.21517504751682281, 0.740301251411438, 0.3460628092288971, -0.5115481615066528, 0.46967509388923645, -0.00984795019030571, -0.13301578164100647, -0.006184384226799011, 0.013667777180671692, 0.1699303388595581, -0.3161454498767853, 0.29015013575553894, 0.6519798040390015, 0.13776443898677826, 0.5275151133537292, 0.14721794426441193, -0.11468257009983063, -0.05685025453567505, 0.21696926653385162, -0.34107062220573425, 0.0935278832912445, -0.039688196033239365, -0.13109605014324188, 0.07406829297542572, 0.1509123593568802, 0.18835929036140442, 0.19146737456321716, -0.38988304138183594, 0.4697469472885132, -0.11145250499248505, 0.039728209376335144, 0.8268787264823914, -0.09761662781238556, -0.04332102835178375, 0.2700135111808777, 0.1207934319972992, 0.05877719447016716, 0.028245486319065094, 0.20692101120948792, 0.6844056844711304, -0.3498411178588867, -0.11976329982280731, -0.396377295255661, 0.23799002170562744, 0.05757361650466919, 0.07855354994535446, 0.3798258602619171, -0.036588408052921295, 0.06831938028335571, 0.10845135152339935, -0.1865023374557495, 0.0892765000462532, -0.27789002656936646, 0.31810519099235535, 0.4251457452774048, -0.035256966948509216, -0.2807217240333557, 0.07315991818904877, 0.13499341905117035, -0.11333761364221573, -0.0008842200040817261, 0.10874118655920029, 0.296818345785141, 0.008288972079753876, 0.24116197228431702, 0.01130960788577795, -0.30095404386520386, -0.4752867817878723, 0.1992175281047821, -0.16108214855194092, 0.01783856749534607, 0.5126014947891235, -0.08679923415184021, 0.3416588008403778, 0.3235914707183838, 0.2577085494995117, 0.2144274115562439, -0.1597137153148651, -0.26682955026626587, 0.22788375616073608, -0.38956791162490845, 0.08458005636930466, -0.15929272770881653, 0.2421140819787979, -0.24793750047683716, -0.3152828514575958, 0.15945720672607422, -0.16866135597229004, 0.19472730159759521, 0.40839430689811707, 0.24238601326942444, -0.2364349514245987, 0.2985266149044037, 0.12915723025798798, 0.32706815004348755, 0.5018091201782227, -0.4053831696510315, -0.023235589265823364, -0.11315590143203735, 0.007632426917552948, -0.22626228630542755, 0.28817909955978394, -0.5816531181335449, 0.15515218675136566, -0.016097508370876312, -0.016345905140042305, 0.09585585445165634, -0.010664891451597214, 0.1402921974658966, -0.22450345754623413, -0.1396103948354721, -0.4073222875595093, -0.2477686107158661, 0.12040270864963531, -0.06779105961322784, 0.44510531425476074, 0.33206677436828613, 0.1980731040239334, -0.06460791826248169, -0.25242677330970764, -0.1272629350423813, 0.4465603232383728, -0.09844805300235748, -0.18762269616127014, 0.16189783811569214, 0.23589575290679932, -0.4479854106903076, 0.21351021528244019, -0.33205288648605347, 0.28407710790634155, -0.09519840776920319, 0.03558272495865822, -0.5180788636207581, -0.273823618888855, 0.03172869607806206, 0.22928576171398163, 0.4715774655342102, -0.48383235931396484, 0.01422564685344696, -0.0810236856341362, 0.1938459277153015, -0.060681067407131195, -0.03779950737953186, -0.2875831723213196, 0.024652402848005295, 0.052711859345436096, -0.22610321640968323, 0.46830445528030396, 0.2961697578430176, 0.14641568064689636, -0.24234764277935028, 0.30126383900642395, -0.011164642870426178, 0.38622337579727173, -0.124844990670681, 0.3365071415901184, 0.1739971935749054, -0.27030548453330994, 0.36919164657592773, 0.2617016136646271, -0.15373270213603973, -0.4315706789493561, 0.35697025060653687, 0.04389272257685661, -0.0654754787683487, 0.5542906522750854, 0.01996980607509613, 0.43128183484077454, -0.014291856437921524, -0.33983248472213745, 0.3250855803489685, 0.21585243940353394, -0.3445807695388794, 0.23752379417419434, 0.18115344643592834, -0.25867414474487305, -0.16033515334129333, -0.16151021420955658, -0.2330635040998459, 0.14865264296531677, -0.3179035186767578, 0.2721554934978485, -0.05992010980844498, 0.161936953663826, 0.07594355195760727, -0.16281592845916748, 0.44893062114715576, -0.4305216670036316, -0.038787614554166794, -0.11722588539123535, 0.07254093140363693, -0.29970499873161316, 0.1654062271118164, -0.15089675784111023, 0.12507867813110352, 0.4372529983520508, 0.13540124893188477, 0.1339181661605835, 0.013776864856481552, 0.2695162892341614, -0.29998600482940674, -0.08645695447921753, 0.12768305838108063, 0.23375648260116577, -0.07325033098459244, -0.0443335622549057, 0.047095995396375656, 0.09582670032978058, 0.2350919246673584, 0.18061956763267517, 0.3537953197956085, 0.1293836236000061, 0.33010751008987427, 0.18966645002365112, 0.07585176825523376, 0.005968615412712097, -0.13233722746372223, 0.1710568368434906, -0.020040705800056458, -0.2805648446083069, -0.09103457629680634, 0.19508640468120575, -0.21115663647651672, -0.1624927520751953, 0.07147711515426636, -0.2013818919658661, 0.15193939208984375, 0.041464678943157196, 0.010748650878667831, 0.02909122407436371, -0.22078242897987366, 0.06446809321641922, -0.2740311324596405, -0.5190434455871582, -0.20539811253547668, 0.17622530460357666, -0.28688907623291016, 0.03056890144944191, 0.29645925760269165, -0.08893127739429474, -0.4425870180130005, 0.09070369601249695, 0.08005643635988235, 0.009866252541542053, -0.07386989891529083, 0.0668322741985321, -0.34370890259742737, 0.23668520152568817, -0.08478264510631561, -0.2740020751953125, -0.3166845142841339, -0.11662208288908005, 0.20027956366539001, 0.3377249538898468, -0.30414462089538574, -0.6180194616317749, 0.0430230051279068, -0.24733665585517883, -0.20657919347286224, -0.37058353424072266, 0.0064486004412174225, 0.2548515200614929, 0.029220985248684883, -0.4174918234348297, 0.06511752307415009, -0.37452077865600586, 0.2269931435585022, 0.22139698266983032, 0.28097647428512573, 0.10008563101291656, -0.03995315730571747, -0.3350542485713959, 0.28511708974838257, 0.18131467700004578, -0.8796138763427734, -0.04131913185119629, -0.6237051486968994, 0.0517050176858902, 0.2354174554347992, -0.0033704787492752075, 0.15842004120349884, 0.02000284567475319, -0.22027355432510376, -0.2730841040611267, -0.23035141825675964, -0.07705625146627426, 0.002099640667438507],
            # fmt: on
        }
    ]
