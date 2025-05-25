module Main exposing (main)

import Browser
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (attribute)
import Html.Events exposing (onClick)
import BigInt exposing (BigInt, fromInt, toString, gte, mul, pow, add)

main =
    Browser.sandbox { init = startingModel, update = update, view = view }

startingModel =
    { currentValue = Tsubu (SmallKazu (fromInt 0))
    , growthPerClick = Tsubu (SmallKazu (fromInt 1))
    }

type Msg = Collect | Upgrade

update : Msg -> Model -> Model
update msg model =
    case msg of
        Collect ->
            collect model
        Upgrade ->
            upgrade model

stringFromBool : Bool -> String
stringFromBool p = case p of
    True -> "true"
    False -> "false"

view model =
    div []
        [ button [ onClick Collect ] [ text "Gather" ]
        , div [] [ text (showValue model.currentValue) ]
        , div [ attribute "enabled" (stringFromBool (canUpgrade model)) ] [ button [ onClick Upgrade ] [ text "Upgrade" ] ]
        , div [] [ text ("(" ++ showValue model.growthPerClick ++ " per click)") ]
        ]

showValue : TsubuCount -> String
showValue (Tsubu tsubu) =
    case tsubu of
        SmallKazu n -> toString n
        MediumKazu mid -> showMid mid
        LargeKazu { mantissa, power } -> showMid mantissa ++ showLocaleLargePower defaultLoc power

showMid : MidKazu -> String
showMid { mantissa, power } = String.fromInt mantissa ++ showLocaleSmallPower defaultLoc power

type Locale = Native

-- STUB - add other locales
defaultLoc = Native

-- STUB - add other locales and support different styles of display for exponents
showLocaleSmallPower locale power =
    case locale of
        Native -> power

showLocaleLargePower locale power =
    case locale of
        Native -> case power of
            Rakusha -> "洛叉"
            Regular reg -> reg

type alias Model = { currentValue: TsubuCount, growthPerClick: TsubuCount }

collect : Model -> Model
collect model =
    { model | currentValue = addTsubu model.currentValue model.growthPerClick
    , growthPerClick = model.growthPerClick
    }

addTsubu : TsubuCount -> TsubuCount -> TsubuCount
addTsubu (Tsubu value) (Tsubu inc) =
    case (value, inc) of
        (SmallKazu n, SmallKazu m) -> Tsubu (SmallKazu (add n m))
        -- STUB - no support for upcasting so we don't worry about the rest of the cases
        (_, _) -> Tsubu value

zeroOut : TsubuCount -> TsubuCount
zeroOut (Tsubu tsubu) =
    Tsubu (case tsubu of
        SmallKazu n -> SmallKazu (fromInt 0)
        MediumKazu { mantissa, power } -> MediumKazu { mantissa = 0, power = power }
        LargeKazu { mantissa, power } -> LargeKazu { mantissa = { mantissa = 0, power = mantissa.power }, power = power }
    )

newGrowthPerClick : Model -> TsubuCount
newGrowthPerClick model =
    Tsubu (case model.currentValue of
        Tsubu (SmallKazu n) -> SmallKazu n
        Tsubu (MediumKazu mid) -> MediumKazu mid
        Tsubu (LargeKazu large) -> LargeKazu large
    )

upgrade: Model -> Model
upgrade model =
    if canUpgrade model
    then { currentValue = zeroOut model.currentValue, growthPerClick = newGrowthPerClick model }
    else model

type Magnitude = Raw BigInt | Log Int Int | LogLog Int Int

magnitude : TsubuCount -> Magnitude
magnitude (Tsubu tsubu) =
    case tsubu of
        SmallKazu n -> Raw n
        MediumKazu { mantissa, power } -> Log mantissa (logSmall power)
        LargeKazu { mantissa, power } ->
            case logLarge power of
                LogLarge n -> Log (logSmall mantissa.power) n
                LogLogLarge n -> LogLog (logSmall mantissa.power) n

canUpgrade model =
    case model.currentValue of
        Tsubu (SmallKazu n) ->
            case model.growthPerClick of
                Tsubu (SmallKazu m) -> gte (n) (mul m (fromInt 10))
                Tsubu (MediumKazu { mantissa, power }) -> gte n (mul (fromInt mantissa) (pow (fromInt 10) (fromInt (logSmall power))))
                Tsubu (LargeKazu { mantissa, power }) -> True
        -- STUB - we can't get this high yet so don't worry
        Tsubu (MediumKazu _) -> True
        -- STUB - we can't get this high yet so don't worry
        Tsubu (LargeKazu { mantissa, power }) -> True

-- Type for representing a number of tsubu (grains, specifically of our sand), which represents both the basic currency unit and score-keeping in the game
type TsubuCount = Tsubu Kazu

-- Type for representing numbers of varying sizes
-- TODO - integrate normalization logic for upcasting once numbers are large enough
type Kazu
    = SmallKazu BigInt
    | MediumKazu MidKazu
    | LargeKazu { mantissa: MidKazu, power: LargePower }

type alias MidKazu = { mantissa: Int, power: SmallPower }

-- Type for representing the magnitude-range that a conceptual number occupies
type ValueRange = SmallRange | MediumRange | LargeRange

-- A ten-power scaled value
type Power
    = Small SmallPower
    | Large LargePower


{- place-scale
    Small (simple) 10-exponent valued powers (N = 10^x)

    SmallPower is represented as an ad-hoc enum (string-backed)
    with its selected values in the smallPowers list,
    and logSmall to obtain the log10 value of the corresponding place-value
-}
type alias SmallPower = String

smallPowers =
  [ "万", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極"
  -- The Nayuta (那由他) below is the short-scale Nayuta, equal to 10^60
  , "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数"
  ]


logSmall power =
  case power of
    "万" -> 4
    "億" -> 8
    "兆" -> 12
    "京" -> 16
    "垓" -> 20
    "秭" -> 24
    "穰" -> 28
    "溝" -> 32
    "澗" -> 36
    "正" -> 40
    "載" -> 44
    "極" -> 48
    "恒河沙" -> 52
    "阿僧祇" -> 56
    "那由他" -> 60
    "不可思議" -> 64
    "無量大数" -> 68
    _ -> Debug.todo "add catchall support"


type LargePower
    = Rakusha -- 洛叉 = 10^5
    | Regular RegularLargePower

{- place-scale
    Square-Rule Large Powers (N = 10 ^ (7 * 2^x))

    RegularLargePower is represented as an ad-hoc enum (string-backed)
    with its selected values in the largePowers list,
    and loglogLarge to obtain the x-value of the corresponding place-value
-}
type alias RegularLargePower = String

type LogLarge = LogLarge Int | LogLogLarge Int

logLarge large =
    case large of
        Rakusha -> LogLarge 5
        Regular regular -> LogLogLarge (logLogRegular regular)


logLogRegular regular =
    case regular of
        "倶胝" -> 0
        "阿庾多" -> 1
        -- The Nayuta (那由他) below is the square-rule Nayuta, equal to 10^28
        "那由他" -> 2
        "頻波羅" -> 3
        "矜羯羅" -> 4
        "阿伽羅" -> 5
        "最勝" -> 6
        "摩婆羅" -> 7
        "阿婆羅" -> 8
        "多婆羅" -> 9
        "界分" -> 10
        "普摩" -> 11
        "禰摩" -> 12
        "阿婆鈐" -> 13
        "弥伽婆" -> 14
        "毘攞伽" -> 15
        "毘伽婆" -> 16
        "僧羯邏摩" -> 17
        "毘薩羅" -> 18
        "毘贍婆" -> 19
        "毘盛伽" -> 20
        "毘素陀" -> 21
        "毘婆訶" -> 22
        "毘薄底" -> 23
        "毘佉擔" -> 24
        -- STUB - add the rest, but we don't have enough of an idea of the basic game loop to need to get even close to this far...
        _ -> Debug.todo "add more large powers, and catchall"
