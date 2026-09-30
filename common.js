/**
 * Octopus Photo Studio - 共通管理スクリプト
 * ・バージョンおよび更新内容の一元管理（メイン＋各ツール計11系統）
 * ・グローバルナビゲーション自動生成（PC動的Priority+ランチャー＆SP横スクロール両立）
 * ・ダークモード（テーマ）切り替え＆永続化
 * ・PCワイド表示切り替え＆永続化
 * ・アコーディオン開閉制御
 * ・ツールアイコン画像の一元自動注入（data-tool-icon対応）
 * ・右下クイックヘルプ（？）の極小半透明化＆モーダル完全ダークモード対応
 * ・モーダル管理 ＆ 戻るボタン/ジェスチャー/タブ再タップ制御（closeTop対応）
 * ・共通Lightbox：ファイル名連動・セーフエリア枠外タップ閉鎖・Esc/矢印キー切替
 */

// ==========================================
// 1. バージョン・更新内容の一元管理
// ==========================================
const OCTOPUS_APP_INFO = {
    version: "1.88",
    date: "2026-09-30",
    updateNote: "PC向けヘッダーナビゲーションの刷新：画面幅連動の動的オーバーフロー（Priority+）および3列グリッド型クイックランチャーの実装",
    tools: {
        index: {
            name: "TOP",
            subVersion: "18",
            updateNote: "ツールカードの自動整列（order連動）スクリプトの実装および「Octopus Photo Grid」カードの追加"
        },
        exif: {
            name: "EXIF Frame",
            subVersion: "138",
            updateNote: "拡大プレビューのファイル名タイトル連動表示、指追従スワイプ・PCキー切替に対応"
        },
        mosaic: {
            name: "Mosaic & Blur",
            subVersion: "120",
            updateNote: "共通クイックヘルプ対応、モーダル表示時の端末戻る操作制御に対応"
        },
        cleaner: {
            name: "EXIF Cleaner",
            subVersion: "7",
            updateNote: "共通クイックヘルプ対応、モーダル表示時の端末戻る操作制御に対応"
        },
        viewedit: {
            name: "EXIF View & Edit",
            subVersion: "30",
            updateNote: "共通クイックヘルプ対応、モーダル表示時の端末戻る操作制御に対応"
        },
        photoprocess: {
            name: "Photo Process",
            subVersion: "15",
            updateNote: "共通クイックヘルプ対応、モーダル表示時の端末戻る操作制御に対応"
        },
        analyzer: {
            name: "EXIF Analyzer",
            subVersion: "18",
            updateNote: "共通クイックヘルプ対応、モーダル表示時の端末戻る操作制御に対応"
        },
        photobatch: {
            name: "Photo Batch",
            subVersion: "3",
            updateNote: "拡大プレビューのファイル名タイトル連動表示、指追従スワイプ・PCキー切替に対応"
        },
        resizer: {
            name: "Image Resizer",
            subVersion: "6",
            updateNote: "一括モード拡大プレビューを共通Lightbox（指追従スワイプ・PCキー切替・セーフエリア枠外タップ）へ刷新"
        },
        grid: {
            name: "Photo Grid",
            subVersion: "7",
            updateNote: "共通クイックヘルプ対応、セル内パン操作ガイド連携およびモーダル戻る操作に対応"
        },
        watermark: {
            name: "Watermark",
            subVersion: "1",
            updateNote: "新規開発：サイン・テキスト・透過ロゴの一括刻印、全面斜めリピート、Exif完全保持、IndexedDB画像管理"
        },
        qrcode: {
            name: "QR Code",
            subVersion: "1",
            updateNote: "新規リリース：完全クライアントサイド動作のQRコード作成、Wi-Fi簡単接続、中央ロゴ合成、高画質SVGベクター出力"
        },
        motiongif: {
            name: "Motion GIF",
            subVersion: "1",
            updateNote: "新規リリース：写真スライドショー＆短尺動画からのアニメーションGIF/APNG生成、Web Worker高速エンコード対応"
        },
        titleimage: {
            name: "Title Image",
            subVersion: "15",
            updateNote: "複数写真プリセット全10系統の配置座標・テキストセンタリングの完全最適化およびオフセット誤連動バグの解消"
        }
    }
};

// ==========================================
// 2. クイックヘルプ用データ定義（全ツール網羅）
// ==========================================
const OCTOPUS_TOOL_HELPS = {
    index: {
        title: "Octopus Tools について",
        desc: "端末のブラウザ上で写真のExifメタデータ編集、フレーム合成、現像、解析を完全ローカルで安全に行える専用ツール群です。",
        points: [
            "写真は外部サーバーへ一切送信されず、端末内（ブラウザ・アプリ）で高速に処理されます。",
            "画面上部のグローバルナビ、または下部メニューから各ツールを自由に切り替えられます。",
            "書き出し画像はファイル保存のほか、長辺2048pxクリップボード直接コピーにも対応しています。"
        ]
    },
    exif: {
        title: "EXIFフレームの使い方",
        desc: "写真のExif撮影情報を自動取得し、美しい余白とカメラ情報テキストを合成します。",
        points: [
            "写真を選択・ドロップすると、カメラ・レンズ・F値・SS・ISO等の撮影設定を自動で取得・配置します。",
            "フォント、文字色、余白幅、メーカーロゴ、区切り文字などを自由にカスタマイズ可能です。",
            "複数写真の一括プレビューに対応し、個別保存やZIP一括保存を行えます。"
        ]
    },
    viewedit: {
        title: "EXIF View & Edit の使い方",
        desc: "写真のメタデータをスプレッドシート風テーブルで一覧確認・直接編集・一括置換します。",
        points: [
            "撮影日時、カメラ機種名、レンズ名、作成者名などをテーブル上で直接打ち換えて書き換えられます。",
            "複数写真の日時一括シフトや、特定項目の一括置換・連番付与に対応しています。",
            "最新Exif規格（2.31/2.32）や各種測定センサー情報も欠落させずに完全保持して保存します。"
        ]
    },
    analyzer: {
        title: "EXIF分析 の使い方",
        desc: "大量の写真から撮影データを一括集計し、撮影傾向をグラフやチャートで可視化します。",
        points: [
            "数百枚〜数千枚の写真を投入するだけで、焦点距離、F値、ISO、シャッター速度の傾向を瞬時に集計します。",
            "よく使う焦点距離やレンズの稼働率を客観的に把握し、機材選定や撮影の振り返りに役立ちます。",
            "集計結果はCSV出力やグラフ画像としての保存が可能です。"
        ]
    },
    mosaic: {
        title: "モザイク & ぼかし の使い方",
        desc: "写真の不要な写り込み、人物の顔、ナンバープレート等を直感的に隠す加工ツールです。",
        points: [
            "モザイク、ぼかし、すりガラス、黒塗りの4種類の加工ブラシを使い分けられます。",
            "矩形選択や自由描画ブラシで、隠したい部分を直感的にマスキングできます。",
            "Exifメタデータは完全に維持したまま、加工後の高画質JPEGを瞬時に書き出せます。"
        ]
    },
    photoprocess: {
        title: "写真加工 の使い方",
        desc: "露出、コントラスト、12色HSL、色温度、切り抜き等をブラウザ内で素早く現像・調整します。",
        points: [
            "リアルタイムピクセル演算により、スライダー操作に遅延なく即座にプレビューが追従します。",
            "作成したお気に入りの調色設定は「プリセット」として保存・エクスポートが可能です。",
            "中央の境界線バーをスライドすることで、加工前後の変化をリアルタイムに比較できます。"
        ]
    },
    photobatch: {
        title: "一括写真加工 の使い方",
        desc: "「Photo Process」で作成した調色プリセットを、複数写真へ一括適用して連続書き出しします。",
        points: [
            "「Photo Process」で保存した調色プリセットを選択し、複数枚の写真へ一括で反映できます。",
            "1枚ずつ順次処理・メモリ解放を行うため、大量の写真を投入しても端末が重くなりません。",
            "元写真のExif情報および解像度（100%フルサイズ）を維持したまま書き出せます。"
        ]
    },
    resizer: {
        title: "画像リサイズ の使い方",
        desc: "比率指定クロップ（アイキャッチ・SNS用）から長辺・パーセント一括縮小までを行えます。",
        points: [
            "1枚モードでは、アイキャッチ（16:9）等の比率枠をドラッグして構図をスマートに切り抜けます。",
            "一括モードでは、投入した全写真の長辺ピクセルやパーセント縮小を一括で行えます。",
            "Exifメタデータの完全保持に対応しており、画質や撮影情報を損なわずに軽量化できます。"
        ]
    },
    cleaner: {
        title: "EXIFクリーナー の使い方",
        desc: "SNS投稿前に、位置情報（GPS）や撮影日時などの個人特定につながる情報を安全に消去します。",
        points: [
            "GPS位置情報のみ、個人情報のみ、または全Exifメタデータの完全消去を選択できます。",
            "複数枚の写真からワンクリックでメタデータを除去し、安全な写真として保存できます。",
            "元画像のピクセルデータは再エンコードによる劣化をさせずに高速処理します。"
        ]
    },
    grid: {
        title: "均等グリッド並べ の使い方",
        desc: "複数枚の写真を縦横の格子状に整列・合成し、1枚の組写真や比較画像を作成します。",
        points: [
            "写真の枚数に応じて最適な格子（2×2、3×3等）を自動構成し、枠の比率も自由に変えられます。",
            "プレビュー枠内をドラッグ（指2本またはPCドラッグ）することで、各セルの構図を微調整できます。",
            "角丸や余白の太さ・背景色を調整し、高解像度保存やクリップボード直接コピーが可能です。"
        ]
    },
    beforeafter: {
        title: "Before After の使い方",
        desc: "2枚の写真をスプリット（分割境界線）または並列で並べ、変化を視覚的に比較・合成します。",
        points: [
            "左右・上下・斜め分割のスプリット線を中心で自在にドラッグして、加工前後の差を確認できます。",
            "プレビュー上で写真をドラッグして被写体の位置合わせ（パン）を行えます。",
            "比較ラインやラベルを入れたまま、高解像度の合成写真として保存またはコピーできます。"
        ]
    },
    watermark: {
        title: "ウォーターマーク の使い方",
        desc: "写真に著作権表記テキスト、サイン、透過ロゴを好みの位置やレイアウトで一括刻印します。",
        points: [
            "四隅や中央の単一配置だけでなく、無断転載を防ぐ全面リピートや斜め透かしスタンプにも対応しています。",
            "透過ロゴ画像は内蔵プリセットのほか、自作ロゴの追加・管理（端末内IndexedDB保存）が可能です。",
            "元写真のExifメタデータ（撮影日時・機材情報等）を完全保持したまま高画質書き出しができます。"
        ]
    },
    qrcode: {
        title: "QRコード作成 の使い方",
        desc: "URLやテキスト、Wi-Fi接続情報を、外部通信を一切行わずにブラウザ内で安全にQRコード化します。",
        points: [
            "入力した内容が外部サーバーへ送信されることは一切なく、機密パスワード等も安全に変換できます。",
            "スマホでかざすだけで接続できる「Wi-Fi簡単接続QR」の生成に対応しています。",
            "印刷用途に適した拡大しても粗くならないSVGベクター保存や、クリップボードへの画像コピーが可能です。"
        ]
    },
    motiongif: {
        title: "アニメGIF作成 の使い方",
        desc: "複数枚の写真や短尺動画から、noteやブログで動く軽量なアニメーションGIF/APNGをブラウザ内で瞬時に作成します。",
        points: [
            "写真は最大20枚まで自由にドラッグして再生順を変更でき、コマ送り速度も細かく設定できます。",
            "動画（MP4/MOV）は必要な範囲だけをスライダーで切り出し（最長10秒）、間引きFPSで軽量なGIFに変換します。",
            "処理はすべて端末内のWeb Workerで安全に行われ、外部サーバーへの通信は一切発生しません。"
        ]
    },
    titleimage: {
        title: "Title Image の使い方",
        desc: "写真とテキストを入力するだけで、アイキャッチやブログサムネイル用のタイトル画像を瞬時に生成します。",
        points: [
            "単体写真だけでなく、最大6枚の写真を使った雑誌風コラージュや分割レイアウトに対応しています。",
            "写真は中央クロップのほか、元比率を崩さない「すりガラス余白」や単色台紙での配置が可能です。",
            "書き出し画像は端末内保存のほか、執筆画面へそのまま貼り付けられるクリップボード直接コピーに対応しています。"
        ]
    }
};

// ==========================================
// 3. ツール定義ナビゲーションリスト（PC / SP 分離版）
// ==========================================
const OCTOPUS_NAV_ITEMS = [
  {
    id: "index",
    name: "TOP",
    tabName: "TOPページ",
    url: "index.html",
    icon: "🐙",
    iconImage: "img/icon_Octopus_丸.png",
    order: 0,
    showInTab: false,
    showInOther: false,
    maxFilesPC: 0,
    maxFilesMobile: 0,
    isSingleOnly: false
  },
  {
    id: "exif",
    name: "EXIFフレーム",
    tabName: "フレーム",
    url: "ExifFrame.html",
    icon: "🖼️",
    iconImage: "img/Exif_Frame_Tool_icon.png",
    order: 10,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 50,
    maxFilesMobile: 30,
    isSingleOnly: false
  },
  {
    id: "mosaic",
    name: "モザイク & ぼかし",
    tabName: "モザイク",
    url: "MosaicBlur.html",
    icon: "🎭",
    iconImage: "img/Mosaic_Blur_Tool_icon.png",
    order: 15,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 1,
    maxFilesMobile: 1,
    isSingleOnly: true
  },
  {
    id: "photoprocess",
    name: "写真加工",
    tabName: "写真加工",
    url: "PhotoProcess.html",
    icon: "🎨",
    iconImage: "img/ico_photo_Process.png",
    order: 25,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 1,
    maxFilesMobile: 1,
    isSingleOnly: true
  },
  {
    id: "resizer",
    name: "画像リサイズ",
    tabName: "リサイズ",
    url: "ImageResize.html",
    icon: "📐",
    iconImage: "img/ico_image_resize.png",
    order: 35,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 50,
    maxFilesMobile: 15,
    isSingleOnly: false
  },
  {
    id: "photobatch",
    name: "一括写真加工",
    tabName: "一括加工",
    url: "PhotoBatch.html",
    icon: "⚡",
    iconImage: "img/ico_photo_Process_batch.png",
    order: 42,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 50,
    maxFilesMobile: 10,
    isSingleOnly: false
  },
  {
    id: "viewedit",
    name: "EXIF View & Edit",
    tabName: "EXIF編集",
    url: "ExifViewEdit.html",
    icon: "📋",
    iconImage: "img/icon_view_edit.png",
    order: 48,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 100,
    maxFilesMobile: 30,
    isSingleOnly: false
  },
  {
    id: "analyzer",
    name: "EXIF分析",
    tabName: "EXIF分析",
    url: "ExifAnalyzer.html",
    icon: "📊",
    iconImage: "img/icon_analyzer.png",
    order: 52,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 3000,
    maxFilesMobile: 500,
    isSingleOnly: false
  },
  {
    id: "titleimage",
    name: "Title Image",
    tabName: "タイトル作成",
    url: "TitleImage.html",
    icon: "🏷️",
    iconImage: "img/icon_title_image.png",
    order: 57,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 6,
    maxFilesMobile: 6,
    isSingleOnly: false
  },
  {
    id: "cleaner",
    name: "EXIFクリーナー",
    tabName: "EXIF消去",
    url: "ExifCleaner.html",
    icon: "🧹",
    iconImage: "img/icon_cleaner.png",
    order: 60,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 200,
    maxFilesMobile: 50,
    isSingleOnly: false
  },
  {
    id: "grid",
    name: "均等グリッド並べ",
    tabName: "グリッド",
    url: "PhotoGrid.html",
    icon: "▦",
    iconImage: "img/ico_photo_grid.png",
    order: 70,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 48,
    maxFilesMobile: 12,
    isSingleOnly: false
  },
  {
    id: "motiongif",
    name: "Motion GIF",
    tabName: "アニメGIF",
    url: "MotionGif.html",
    icon: "🎬",
    iconImage: "img/icon_motion_gif.png",
    order: 75,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 40,
    maxFilesMobile: 20,
    isSingleOnly: false
  },
  {
    id: "beforeafter",
    name: "Before After",
    tabName: "比較画像",
    url: "BeforeAfter.html",
    icon: "◫",
    iconImage: "img/icon_before_after.png",
    order: 80,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 2,
    maxFilesMobile: 2,
    isSingleOnly: false
  },
  {
    id: "watermark",
    name: "ウォーターマーク",
    tabName: "透かし",
    url: "WatermarkBatch.html",
    icon: "🖋",
    iconImage: "img/icon_watermark.png",
    order: 90,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 50,
    maxFilesMobile: 15,
    isSingleOnly: false
  },
  {
    id: "qrcode",
    name: "Octopus QR Code",
    tabName: "QR作成",
    url: "QRCode.html",
    icon: "🏁",
    iconImage: "img/icon_octopus_qrcode.png",
    order: 95,
    showInTab: false,
    showInOther: true,
    maxFilesPC: 1,
    maxFilesMobile: 1,
    isSingleOnly: true
  },
  {
    id: "other",
    name: "その他ツール",
    tabName: "その他",
    url: "#other",
    icon: "📂",
    iconImage: "",
    order: 900,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 0,
    maxFilesMobile: 0,
    isSingleOnly: false
  },
  {
    id: "menu",
    name: "メニュー・設定",
    tabName: "メニュー",
    url: "app/Menu.html",
    icon: "⚙️",
    iconImage: "",
    order: 999,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 0,
    maxFilesMobile: 0,
    isSingleOnly: false
  }
];

// ==========================================
// 4. Web用 GA4 自動判定・配信スクリプト
// ==========================================
(function() {
  if (window.AndroidBridge) {
    return;
  }

  const GA_MEASUREMENT_ID = 'G-NYCV0Y514R';
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();

function getToolMaxFiles(toolId) {
  const item = OCTOPUS_NAV_ITEMS.find(t => t.id === toolId);
  if (!item) return 1;

  const isMobile = !!window.AndroidBridge || 
                   /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                   (window.innerWidth <= 768);

  return isMobile ? item.maxFilesMobile : item.maxFilesPC;
}

function updateToolMaxFilesUI(toolId) {
  const max = getToolMaxFiles(toolId);
  document.querySelectorAll('[data-octopus-max-files]').forEach(el => {
    el.textContent = max.toLocaleString();
  });
}

function updateToolIconsUI() {
  const isSubDir = window.location.pathname.includes('/app/');
  const pathPrefix = isSubDir ? '../' : '';

  document.querySelectorAll('[data-tool-icon]').forEach(el => {
    const toolId = el.getAttribute('data-tool-icon');
    const tool = OCTOPUS_NAV_ITEMS.find(t => t.id === toolId);
    if (!tool) return;

    if (el.tagName.toLowerCase() === 'img') {
      if (tool.iconImage) {
        el.src = pathPrefix + tool.iconImage;
        el.alt = `${tool.name} アイコン`;
      }
      el.onerror = () => {
        el.outerHTML = `<span class="tool-fallback-icon" style="font-size:22px; line-height:1;">${tool.icon || '🔧'}</span>`;
      };
    } else {
      if (tool.iconImage) {
        el.innerHTML = `<img src="${pathPrefix + tool.iconImage}" alt="${tool.name}" class="header-icon" onerror="this.outerHTML='<span>${tool.icon || '🔧'}</span>'">`;
      } else {
        el.innerHTML = `<span>${tool.icon || '🔧'}</span>`;
      }
    }
  });
}

// 共通スタイルの動的注入
function injectCommonStyles() {
    if (document.getElementById('_octopusCommonStyles')) return;
    const style = document.createElement('style');
    style.id = '_octopusCommonStyles';
    style.textContent = `
        /* 右下フローティングヘルプ（？）ボタン：半透明・極小化 */
        .octopus-help-fab {
            position: fixed;
            right: 14px;
            bottom: 16px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(74, 124, 89, 0.45);
            backdrop-filter: blur(3px);
            color: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
            font-size: 13px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 850;
            transition: transform 0.15s ease, background 0.2s ease, opacity 0.2s ease;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            line-height: 1;
        }
        .octopus-help-fab:active {
            transform: scale(0.90);
            background: rgba(59, 100, 71, 0.75);
            color: #ffffff;
        }

        /* クイックヘルプモーダル：ダークモード完全対応 */
        .octopus-help-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(3px);
            z-index: 99990;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            padding: 16px;
            box-sizing: border-box;
        }
        .octopus-help-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }
        .octopus-help-dialog {
            background: var(--card-bg, #ffffff);
            color: var(--text-color, #222222);
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 14px;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            transform: translateY(12px) scale(0.98);
            transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1);
        }
        .octopus-help-overlay.open .octopus-help-dialog {
            transform: translateY(0) scale(1);
        }
        .octopus-help-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 18px;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            background: var(--card-bg-sub, #f8fafc);
            color: var(--text-color, #222222);
        }
        .octopus-help-title {
            font-size: 15px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-color, #222222);
        }
        .octopus-help-close {
            background: transparent;
            border: none;
            font-size: 20px;
            color: var(--text-muted, #888888);
            cursor: pointer;
            padding: 4px;
            line-height: 1;
        }
        .octopus-help-body {
            padding: 18px;
            font-size: 13.5px;
            line-height: 1.6;
            color: var(--text-color, #222222);
        }
        .octopus-help-desc {
            margin-bottom: 14px;
            color: var(--text-muted, #555555);
        }
        .octopus-help-list {
            margin: 0;
            padding-left: 20px;
            color: var(--text-color, #222222);
        }
        .octopus-help-list li {
            margin-bottom: 8px;
        }
        .octopus-help-footer {
            padding: 12px 18px;
            border-top: 1px solid var(--border-color, #e2e8f0);
            display: flex;
            justify-content: flex-end;
            background: var(--card-bg-sub, #f8fafc);
        }
        .octopus-help-btn {
            background: #4A7C59;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            padding: 8px 18px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
        }

        /* ダークモード時の強制コントラスト補正 */
        [data-theme="dark"] .octopus-help-dialog {
            background: #1C1E1B;
            border-color: #2E332D;
            color: #EEEEEE;
        }
        [data-theme="dark"] .octopus-help-header,
        [data-theme="dark"] .octopus-help-footer {
            background: #232722;
            border-color: #2E332D;
            color: #EEEEEE;
        }
        [data-theme="dark"] .octopus-help-title {
            color: #EEEEEE;
        }
        [data-theme="dark"] .octopus-help-desc {
            color: #AAAAAA;
        }
        [data-theme="dark"] .octopus-help-close {
            color: #8E8E93;
        }

        /* 共通Lightbox */
        .octopus-lightbox-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            background: rgba(0, 0, 0, 0.94) !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            touch-action: none;
            box-sizing: border-box !important;
        }
        .octopus-lightbox-overlay.open {
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        .octopus-lightbox-header {
            height: 50px;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            background: rgba(0, 0, 0, 0.65);
            color: #ffffff;
            z-index: 2;
        }
        .octopus-lightbox-title {
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 80%;
        }
        .octopus-lightbox-close {
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 26px;
            cursor: pointer;
            padding: 4px 10px;
            line-height: 1;
        }
        .octopus-lightbox-stage {
            flex: 1;
            min-height: 0 !important;
            min-width: 0 !important;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            box-sizing: border-box;
        }
        .octopus-lightbox-slider {
            width: 100%;
            height: 100%;
            min-height: 0 !important;
            min-width: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            will-change: transform;
        }
        .octopus-lightbox-img {
            max-width: 95vw !important;
            max-height: 84vh !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            border-radius: 4px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            pointer-events: none;
            user-select: none;
        }
        .octopus-lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.45);
            color: #ffffff;
            border: none;
            border-radius: 50%;
            width: 46px;
            height: 46px;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: background 0.2s, transform 0.15s;
        }
        .octopus-lightbox-nav:hover { background: rgba(0, 0, 0, 0.8); }
        .octopus-lightbox-nav:active { transform: translateY(-50%) scale(0.92); }
        .octopus-lightbox-nav.prev { left: 16px; }
        .octopus-lightbox-nav.next { right: 16px; }
        @media (max-width: 768px) {
            .octopus-lightbox-nav { display: none; }
        }

        .octopus-lightbox-footer {
            height: 52px;
            min-height: 52px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            background: rgba(0, 0, 0, 0.65);
            z-index: 2;
        }
        .octopus-lightbox-dots {
            display: flex;
            gap: 6px;
            align-items: center;
        }
        .octopus-lightbox-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.35);
            transition: background 0.2s, transform 0.2s;
        }
        .octopus-lightbox-dot.active {
            background: #4A7C59;
            transform: scale(1.3);
        }
        .octopus-lightbox-counter {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.75);
            font-family: monospace;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 5. モーダル管理 ＆ 戻るボタン/ジェスチャー制御
// ==========================================
window.octopusModal = (function() {
    const modalStack = [];
    let isHandlingPopState = false;

    window.addEventListener('popstate', (e) => {
        if (modalStack.length > 0) {
            isHandlingPopState = true;
            const topModal = modalStack.pop();
            if (topModal && typeof topModal.closeFn === 'function') {
                topModal.closeFn();
            }
            isHandlingPopState = false;
        }
    });

    return {
        open: function(modalEl, closeFn) {
            if (!modalEl) return;
            try {
                history.pushState({ octopusModalOpen: true, time: Date.now() }, "");
            } catch (e) {
                console.warn("History pushState skipped:", e);
            }

            modalStack.push({
                el: modalEl,
                closeFn: closeFn || (() => {
                    modalEl.style.display = 'none';
                    modalEl.classList.remove('open');
                })
            });
        },
        close: function(modalEl) {
            const index = modalStack.findIndex(item => item.el === modalEl);
            if (index !== -1) {
                const item = modalStack.splice(index, 1)[0];
                if (!isHandlingPopState) {
                    try {
                        history.back();
                    } catch (e) {}
                }
                if (item && typeof item.closeFn === 'function') {
                    item.closeFn();
                }
            }
        },
        closeTop: function() {
            if (modalStack.length > 0) {
                const item = modalStack.pop();
                if (!isHandlingPopState) {
                    try {
                        history.back();
                    } catch (e) {}
                }
                if (item && typeof item.closeFn === 'function') {
                    item.closeFn();
                }
                return true;
            }
            return false;
        },
        hasOpenModal: function() {
            return modalStack.length > 0;
        }
    };
})();

// ==========================================
// 6. 指追従スワイプ・セーフエリア付き共通Lightbox
// ==========================================
window.octopusShowImageViewer = function(options) {
    injectCommonStyles();

    let { images = [], titles = [], initialIndex = 0, title = "" } = options;
    if (!images || images.length === 0) return;

    if (typeof images[0] === 'object' && images[0] !== null) {
        titles = images.map(item => item.title || item.name || item.filename || "");
        images = images.map(item => item.url || item.dataUrl || item.src || "");
    }

    let currentIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
    const total = images.length;

    const existing = document.getElementById('_octopusCommonLightbox');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = '_octopusCommonLightbox';
    overlay.className = 'octopus-lightbox-overlay';

    const initialTitle = (titles && titles[currentIndex]) ? titles[currentIndex] : (title || '画像プレビュー');

    overlay.innerHTML = `
        <div class="octopus-lightbox-header">
            <span class="octopus-lightbox-title">${initialTitle}</span>
            <button class="octopus-lightbox-close" aria-label="閉じる">✕</button>
        </div>
        <div class="octopus-lightbox-stage">
            <div class="octopus-lightbox-slider" id="_octopusLightboxSlider">
                <img src="${images[currentIndex]}" class="octopus-lightbox-img" id="_octopusLightboxImg" alt="拡大プレビュー">
            </div>
            ${total > 1 ? '<button class="octopus-lightbox-nav prev" id="_octopusLightboxPrev">‹</button><button class="octopus-lightbox-nav next" id="_octopusLightboxNext">›</button>' : ''}
        </div>
        <div class="octopus-lightbox-footer">
            ${total > 1 ? `
                <div class="octopus-lightbox-dots" id="_octopusLightboxDots"></div>
                <div class="octopus-lightbox-counter" id="_octopusLightboxCounter"></div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(overlay);

    const slider = overlay.querySelector('#_octopusLightboxSlider');
    const imgEl = overlay.querySelector('#_octopusLightboxImg');
    const titleEl = overlay.querySelector('.octopus-lightbox-title');
    const closeBtn = overlay.querySelector('.octopus-lightbox-close');
    const prevBtn = overlay.querySelector('#_octopusLightboxPrev');
    const nextBtn = overlay.querySelector('#_octopusLightboxNext');
    const dotsContainer = overlay.querySelector('#_octopusLightboxDots');
    const counterEl = overlay.querySelector('#_octopusLightboxCounter');

    function updateView(direction = 0) {
        if (!imgEl) return;
        imgEl.src = images[currentIndex];
        imgEl.style.transform = 'translateX(0px)';
        imgEl.style.transition = 'none';

        if (titleEl) {
            const currentTitle = (titles && titles[currentIndex]) ? titles[currentIndex] : (title || '画像プレビュー');
            titleEl.textContent = currentTitle;
            titleEl.title = currentTitle;
        }

        if (total > 1 && counterEl && dotsContainer) {
            counterEl.textContent = `${currentIndex + 1} / ${total}`;
            dotsContainer.innerHTML = '';
            const maxDots = Math.min(total, 8);
            for (let i = 0; i < maxDots; i++) {
                const dot = document.createElement('span');
                dot.className = 'octopus-lightbox-dot' + (i === currentIndex ? ' active' : '');
                dotsContainer.appendChild(dot);
            }
        }
    }

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isTracking = false;
    let isHorizontalSwipe = false;

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = startX;
            isTracking = true;
            isHorizontalSwipe = false;
            slider.style.transition = 'none';
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isTracking || e.touches.length !== 1) return;
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            const diffY = e.touches[0].clientY - startY;

            if (!isHorizontalSwipe) {
                if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
                    isHorizontalSwipe = true;
                } else if (Math.abs(diffY) > 10) {
                    isTracking = false;
                    return;
                }
            }

            if (isHorizontalSwipe) {
                let moveX = diffX;
                if ((currentIndex === 0 && diffX > 0) || (currentIndex === total - 1 && diffX < 0)) {
                    moveX = diffX * 0.32;
                }
                slider.style.transform = `translateX(${moveX}px)`;
            }
        }, { passive: true });

        slider.addEventListener('touchend', () => {
            if (!isTracking || !isHorizontalSwipe) {
                isTracking = false;
                return;
            }
            isTracking = false;
            const diffX = currentX - startX;
            const threshold = 50;

            slider.style.transition = 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)';

            if (diffX < -threshold && currentIndex < total - 1) {
                slider.style.transform = `translateX(-100%)`;
                setTimeout(() => {
                    currentIndex++;
                    updateView(1);
                    slider.style.transition = 'none';
                    slider.style.transform = 'translateX(0px)';
                }, 200);
            } else if (diffX > threshold && currentIndex > 0) {
                slider.style.transform = `translateX(100%)`;
                setTimeout(() => {
                    currentIndex--;
                    updateView(-1);
                    slider.style.transition = 'none';
                    slider.style.transform = 'translateX(0px)';
                }, 200);
            } else {
                slider.style.transform = 'translateX(0px)';
            }
        }, { passive: true });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateView(-1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < total - 1) {
                currentIndex++;
                updateView(1);
            }
        });
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            window.octopusModal.close(overlay);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateView(-1);
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < total - 1) {
                currentIndex++;
                updateView(1);
            }
        }
    }
    document.addEventListener('keydown', handleKeyDown);

    function closeLightbox() {
        document.removeEventListener('keydown', handleKeyDown);
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 200);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.octopusModal.close(overlay);
        });
    }

    overlay.addEventListener('click', (e) => {
        if (e.target.closest('.octopus-lightbox-header') ||
            e.target.closest('.octopus-lightbox-footer') ||
            e.target.closest('.octopus-lightbox-nav')) {
            return;
        }

        const clickX = e.clientX;
        const clickY = e.clientY;

        if (imgEl) {
            const imgRect = imgEl.getBoundingClientRect();
            const safeMargin = 28;
            if (clickX >= imgRect.left - safeMargin &&
                clickX <= imgRect.right + safeMargin &&
                clickY >= imgRect.top - safeMargin &&
                clickY <= imgRect.bottom + safeMargin) {
                return;
            }
        }

        const footer = overlay.querySelector('.octopus-lightbox-footer');
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            if (clickY >= footerRect.top - 24) {
                return;
            }
        }

        const header = overlay.querySelector('.octopus-lightbox-header');
        if (header) {
            const headerRect = header.getBoundingClientRect();
            if (clickY <= headerRect.bottom + 16) {
                return;
            }
        }

        window.octopusModal.close(overlay);
    });

    updateView(0);
    setTimeout(() => overlay.classList.add('open'), 10);
    window.octopusModal.open(overlay, closeLightbox);
};

// ==========================================
// 7. 共通UI・ヘルプモーダル制御 ＆ 動的ランチャーナビゲーション
// ==========================================
(function() {
    function getCurrentPageKey() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("beforeafter")) return "beforeafter";
        if (path.includes("photogrid")) return "grid";
        if (path.includes("exifanalyzer")) return "analyzer";
        if (path.includes("photoprocess")) return "photoprocess";
        if (path.includes("exifviewedit")) return "viewedit";
        if (path.includes("exifcleaner")) return "cleaner";
        if (path.includes("exifframe")) return "exif";
        if (path.includes("mosaicblur")) return "mosaic";
        if (path.includes("photobatch")) return "photobatch";
        if (path.includes("watermarkbatch")) return "watermark";
        if (path.includes("imageresize")) return "resizer";
        if (path.includes("qrcode")) return "qrcode";
        if (path.includes("motiongif")) return "motiongif";
        if (path.includes("titleimage")) return "titleimage";
        return "index";
    }

    function initHelpFab(pageKey) {
        if (window.location.pathname.includes('/app/')) return;
        const helpData = OCTOPUS_TOOL_HELPS[pageKey];
        if (!helpData) return;

        const fab = document.createElement('button');
        fab.className = 'octopus-help-fab';
        fab.innerHTML = '?';
        fab.setAttribute('aria-label', `${helpData.title} のクイックヘルプ`);
        document.body.appendChild(fab);

        const overlay = document.createElement('div');
        overlay.className = 'octopus-help-overlay';
        overlay.innerHTML = `
            <div class="octopus-help-dialog">
                <div class="octopus-help-header">
                    <span class="octopus-help-title">💡 ${helpData.title}</span>
                    <button class="octopus-help-close" aria-label="閉じる">✕</button>
                </div>
                <div class="octopus-help-body">
                    <div class="octopus-help-desc">${helpData.desc}</div>
                    <ul class="octopus-help-list">
                        ${helpData.points.map(pt => `<li>${pt}</li>`).join('')}
                    </ul>
                </div>
                <div class="octopus-help-footer">
                    <button class="octopus-help-btn">了解</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        function closeHelp() {
            overlay.classList.remove('open');
        }

        fab.addEventListener('click', () => {
            overlay.classList.add('open');
            window.octopusModal.open(overlay, closeHelp);
        });

        overlay.querySelector('.octopus-help-close').addEventListener('click', () => {
            window.octopusModal.close(overlay);
        });
        overlay.querySelector('.octopus-help-btn').addEventListener('click', () => {
            window.octopusModal.close(overlay);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                window.octopusModal.close(overlay);
            }
        });
    }

    let isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-btn');
        if (!themeBtn) return;
        themeBtn.textContent = isDark ? '☀️' : '🌙';

        themeBtn.addEventListener('click', () => {
            isDark = !isDark;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            themeBtn.textContent = isDark ? '☀️' : '🌙';
            window.dispatchEvent(new CustomEvent('octopus:themechange', { detail: { isDark } }));
        });
    }

    function initWideModeToggle(pageKey) {
        const mainContainer = document.getElementById('main-container');
        const wideToggleBtn = document.getElementById('wide-toggle-btn');
        if (!mainContainer || !wideToggleBtn) return;

        let isWideMode = localStorage.getItem('octopus_wide_mode') === 'true';

        const applyWideMode = (notify = false) => {
            if (isWideMode) {
                mainContainer.classList.add('wide-mode');
                wideToggleBtn.textContent = '⤡ 標準幅に戻す';
            } else {
                mainContainer.classList.remove('wide-mode');
                wideToggleBtn.textContent = '⤢ ワイド表示';
            }
            if (notify) {
                window.dispatchEvent(new CustomEvent('octopus:widemode', { detail: { isWideMode } }));
            }
        };

        applyWideMode(false);

        wideToggleBtn.addEventListener('click', () => {
            isWideMode = !isWideMode;
            localStorage.setItem('octopus_wide_mode', isWideMode ? 'true' : 'false');
            applyWideMode(true);
        });
    }

    window.toggleAccordion = function(contentId, headerEl) {
        const content = document.getElementById(contentId);
        if (!content) return;
        content.classList.toggle('open');
        const span = headerEl ? headerEl.querySelector('span') : null;
        if (span) {
            span.textContent = content.classList.contains('open') ? '▲' : '▼';
        }
    };

    // ==========================================
    // 動的オーバーフロー＆全ツールランチャー構築
    // ==========================================
    function initDynamicNavigation(currentKey) {
        const navContainer = document.getElementById("global-nav");
        if (!navContainer) return;

        const targetItems = OCTOPUS_NAV_ITEMS
            .filter(item => item.id !== "menu" && item.id !== "other")
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        const isSubDir = window.location.pathname.includes('/app/');
        const pathPrefix = isSubDir ? '../' : '';

        // 1. バー用ピル群HTML
        const trackHtml = targetItems.map(item => {
            const isActive = item.id === currentKey ? " active" : "";
            const href = isSubDir ? pathPrefix + item.url : item.url;
            return `<a href="${href}" class="nav-item${isActive}" data-nav-id="${item.id}"><span>${item.icon}</span> ${item.name}</a>`;
        }).join("");

        // 2. ランチャー内3列カード群HTML
        const gridHtml = targetItems.map(item => {
            const isActive = item.id === currentKey ? " active" : "";
            const href = isSubDir ? pathPrefix + item.url : item.url;
            const iconHtml = item.iconImage
                ? `<img src="${pathPrefix + item.iconImage}" alt="${item.name}" onerror="this.outerHTML='<span>${item.icon}</span>'">`
                : `<span>${item.icon}</span>`;
            return `
                <a href="${href}" class="nav-launcher-card${isActive}">
                    <div class="nav-launcher-card-icon">${iconHtml}</div>
                    <div class="nav-launcher-card-name">${item.tabName || item.name}</div>
                </a>
            `;
        }).join("");

        navContainer.className = "global-nav";
        navContainer.setAttribute("aria-label", "ツール切り替え");
        navContainer.innerHTML = `
            <div class="nav-track" id="_navTrack">${trackHtml}</div>
            <div class="nav-launcher-wrap" id="_navLauncherWrap">
                <button type="button" class="nav-launcher-btn" id="_navLauncherBtn" aria-haspopup="true" aria-expanded="false">
                    <span class="nav-launcher-icon">⊞</span>
                    <span class="nav-launcher-label" id="_navLauncherLabel">全ツール</span>
                    <span class="nav-launcher-arrow">▾</span>
                </button>
                <div class="nav-launcher-popover" id="_navLauncherPopover">
                    <div class="nav-launcher-popover-header">
                        <div class="nav-launcher-popover-title">
                            <span>⊞ 全ツールマスター一覧</span>
                            <span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">(${targetItems.length})</span>
                        </div>
                        <button type="button" class="nav-launcher-popover-close" id="_navLauncherClose" aria-label="閉じる">✕</button>
                    </div>
                    <div class="nav-launcher-grid">
                        ${gridHtml}
                    </div>
                </div>
            </div>
        `;

        const trackEl = document.getElementById('_navTrack');
        const launcherWrap = document.getElementById('_navLauncherWrap');
        const launcherBtn = document.getElementById('_navLauncherBtn');
        const launcherLabel = document.getElementById('_navLauncherLabel');
        const popover = document.getElementById('_navLauncherPopover');
        const closeBtn = document.getElementById('_navLauncherClose');
        const navItemEls = Array.from(trackEl.querySelectorAll('.nav-item'));

        // 各アイテムの実寸幅キャッシュ（IDキーで完全保持）
        const itemWidthMap = new Map();

        function measureAllItemWidths() {
            navItemEls.forEach(el => {
                const id = el.getAttribute('data-nav-id');
                // 一時的に表示させて正確な実寸を取得
                const currentDisplay = el.style.display;
                if (currentDisplay === 'none') {
                    el.style.visibility = 'hidden';
                    el.style.display = 'inline-flex';
                }
                const rect = el.getBoundingClientRect();
                if (rect.width > 0) {
                    // 小数点の切り上げ＋1px余裕を持たせてキャッシュ
                    itemWidthMap.set(id, Math.ceil(rect.width) + 1);
                }
                if (currentDisplay === 'none') {
                    el.style.display = 'none';
                    el.style.visibility = '';
                }
            });
        }

        // 動的幅計算とオーバーフロー制御（Priority+）
        function updateNavOverflow() {
            const isPC = window.innerWidth >= 861;
            if (!isPC) {
                // スマホ表示：全件表示に戻して横スクロールに委ねる
                navItemEls.forEach(el => el.style.display = '');
                launcherBtn.classList.remove('active');
                launcherLabel.textContent = '全ツール';
                return;
            }

            if (itemWidthMap.size === 0) {
                measureAllItemWidths();
            }

            // トラックの実効幅（見切れ防止のため8pxの安全バッファを差し引く）
            const trackWidth = trackEl.clientWidth - 8;
            const gap = 8;
            let currentX = 0;
            let currentToolVisible = false;

            navItemEls.forEach(el => {
                const id = el.getAttribute('data-nav-id');
                const w = itemWidthMap.get(id) || 130;
                const nextX = currentX === 0 ? w : currentX + gap + w;

                // 安全枠内に100%収まるボタンだけを表示、少しでも超えたら即座に格納
                if (nextX <= trackWidth) {
                    el.style.display = 'inline-flex';
                    currentX = nextX;
                    if (id === currentKey) {
                        currentToolVisible = true;
                    }
                } else {
                    el.style.display = 'none';
                }
            });

            // 現在開いているツールがバーから溢れている場合のスマート通知
            const currentItem = targetItems.find(t => t.id === currentKey);
            if (!currentToolVisible && currentItem) {
                launcherBtn.classList.add('active');
                launcherLabel.textContent = `全ツール (${currentItem.tabName || currentItem.name})`;
            } else {
                launcherBtn.classList.remove('active');
                launcherLabel.textContent = '全ツール';
            }
        }

        // ポップオーバーのクリック開閉
        function togglePopover(open) {
            const willOpen = typeof open === 'boolean' ? open : !popover.classList.contains('open');
            popover.classList.toggle('open', willOpen);
            launcherBtn.classList.toggle('open', willOpen);
            launcherBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        }

        launcherBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePopover();
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePopover(false);
        });

        // 枠外クリックまたはEscキーで閉じる
        document.addEventListener('click', (e) => {
            if (!launcherWrap.contains(e.target)) {
                togglePopover(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                togglePopover(false);
            }
        });

        // 初回測定＆実行
        measureAllItemWidths();
        updateNavOverflow();

        // Webフォント読み込み完了時に正確な文字幅で再同期
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                measureAllItemWidths();
                updateNavOverflow();
            });
        }

        // リサイズ・ワイド表示連動
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateNavOverflow();
            }, 30);
        });

        window.addEventListener('octopus:widemode', () => {
            setTimeout(() => {
                updateNavOverflow();
            }, 260);
        });
    }



    document.addEventListener("DOMContentLoaded", () => {
        const currentKey = getCurrentPageKey();
        const toolInfo = OCTOPUS_APP_INFO.tools[currentKey];

        injectCommonStyles();

        const versionEl = document.getElementById("version-display");
        if (versionEl) {
            versionEl.textContent = `v${OCTOPUS_APP_INFO.version}`;
            if (toolInfo) {
                versionEl.title = 
                    `【全体 v${OCTOPUS_APP_INFO.version} (${OCTOPUS_APP_INFO.date})】\n` +
                    `・${OCTOPUS_APP_INFO.updateNote}\n\n` +
                    `【${toolInfo.name} Build: ${toolInfo.subVersion}】\n` +
                    `・${toolInfo.updateNote}`;
            }
        }

        initDynamicNavigation(currentKey);
        initThemeToggle();
        initWideModeToggle(currentKey);

        if (currentKey !== "index" && currentKey !== "menu") {
            updateToolMaxFilesUI(currentKey);
        }

        updateToolIconsUI();
        initHelpFab(currentKey);
    });
})();