"""路線バス事業者メタ — 名称・色・決済タグの単一ソース。

新事業者追加時はここに1エントリ足すだけ。UI は operator-ui.js + data.js 経由で自動反映。
"""

from __future__ import annotations

TANEYAKU_OPERATOR = {
    "ja": "種子島・屋久島交通",
    "zh": "种子岛·屋久岛交通",
    "en": "Tanegashima Yakushima Kotsu",
    "short": {"ja": "種屋交通", "zh": "种屋交通", "en": "Taneyaku"},
    "color": "#2d6a4f",
    "acceptsPass": True,
    "acceptsIc": True,
    "paymentTags": [
        {"positive": True, "ja": "満喫券可", "zh": "可用乘车券", "en": "Day pass OK"},
        {"positive": True, "ja": "IC可", "zh": "可用IC", "en": "IC OK"},
    ],
}

MATSUBANDA_OPERATOR = {
    "ja": "まつばんだ交通",
    "zh": "松ばんだ交通",
    "en": "Matsubanda Kotsu",
    "short": {"ja": "まつばんだ", "zh": "松ばんだ", "en": "Matsubanda"},
    "color": "#5c4d7a",
    "acceptsPass": False,
    "acceptsIc": False,
    "paymentTags": [
        {"positive": False, "ja": "満喫券不可", "zh": "不可用乘车券", "en": "No day pass"},
        {"positive": False, "ja": "現金のみ", "zh": "仅现金", "en": "Cash only"},
    ],
}

OPERATORS = {
    "taneyaku": TANEYAKU_OPERATOR,
    "matsubanda": MATSUBANDA_OPERATOR,
}
