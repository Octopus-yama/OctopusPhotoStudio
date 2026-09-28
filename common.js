/**
 * Octopus Photo Studio - 共通管理スクリプト
 * ・バージョンおよび更新内容の一元管理（メイン＋各ツール計7系統）
 * ・グローバルナビゲーション自動生成
 * ・ダークモード（テーマ）切り替え＆永続化
 * ・PCワイド表示切り替え＆永続化
 * ・アコーディオン開閉制御
 */
 

// ==========================================

const OCTOPUS_APP_INFO = {
    // 1. メイン（共通）バージョン情報
    version: "1.68",
    date: "2026-09-28",
    updateNote: "名称を「Octopus Photo Studio」に改名／「Octopus EXIF Frame」のExif再保存パイプラインを刷新（piexif未定義タグによるクラッシュ根絶・最新タグ動的登録・日本語安全エスケープ対応）",

    // 2. 各ツールの個別サブバージョン・更新内容
    tools: {
        index: {
            name: "TOP",
            subVersion: "17",
            updateNote: "共通管理基盤（v1.65）への内部同期"
        },
        exif: {
            name: "EXIF Frame",
            subVersion: "136",
            updateNote: "Exif埋め込み処理を刷新（16進数定数指定、最新Exif規格タグ動的注入、未知タグ型自動補完、全角文字エスケープ、2段構えダンプフォールバック、生成・一括DLエラーハンドリング強化）"
        },
        mosaic: {
            name: "Mosaic & Blur",
            subVersion: "119",
            updateNote: "Exif保存処理を刷新（最新規格・メーカー独自タグ・測定センサータグの動的型補完、有理数バイナリ補正、サムネイル破棄による情報漏洩防止＆2段構えダンプ）"
        },
        cleaner: {
            name: "EXIF Cleaner",
            subVersion: "6",
            updateNote: "ファイル読み込み上限管理を common.js に一元化し、アクセス端末に応じた動的枚数表示に対応"
        },
        viewedit: {
            name: "EXIF View & Edit",
            subVersion: "29",
            updateNote: "Exif保存時の測定センサー系タグ（外気温度・気圧・水深・加速度等）の型定義登録および有理数バイナリパック補正によるメタデータ保持強化"
        },
        photoprocess: {
            name: "Photo Process",
            subVersion: "14",
            updateNote: "Exif保存処理を刷新（最新規格・独自タグ・測定センサータグの動的型補完、有理数バイナリ補正、サムネイル破棄＆2段構えダンプによるメタデータ完全保持）"
        },
        analyzer: {
            name: "EXIF Analyzer",
            subVersion: "17",
            updateNote: "ファイル読み込み上限管理を common.js に一元化し、アクセス端末に応じた動的枚数表示に対応"
        }
    }
};

// ==========================================
// ツール定義ナビゲーションリスト（PC / SP 分離版）
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
    id: "viewedit",
    name: "EXIF View & Edit",
    tabName: "編集",
    url: "ExifViewEdit.html",
    icon: "📋",
    iconImage: "img/icon_view_edit.png",
    order: 20,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 100,
    maxFilesMobile: 30,
    isSingleOnly: false
  },
  {
    id: "analyzer",
    name: "EXIF分析",
    tabName: "分析",
    url: "ExifAnalyzer.html",
    icon: "📊",
    iconImage: "img/icon_analyzer.png",
    order: 30,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 3000,
    maxFilesMobile: 500,
    isSingleOnly: false
  },
  {
    id: "mosaic",
    name: "モザイク & ぼかし",
    tabName: "モザイク",
    url: "MosaicBlur.html",
    icon: "🎭",
    iconImage: "img/Mosaic_Blur_Tool_icon.png",
    order: 40,
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
    order: 50,
    showInTab: true,
    showInOther: false,
    maxFilesPC: 1,
    maxFilesMobile: 1,
    isSingleOnly: true
  },
  {
    id: "cleaner",
    name: "EXIFクリーナー",
    tabName: "消去",
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
// Web用 GA4 自動判定・配信スクリプト
// ==========================================
(function() {
  // アプリ（AndroidBridgeが存在する）環境の場合はWeb用GAを読み込まず終了
  if (window.AndroidBridge) {
    return;
  }

  // ここから下はWebブラウザで開かれた時だけ実行される
  const GA_MEASUREMENT_ID = 'G-NYCV0Y514R';

  // gtag.js の動的読み込み
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



/**
 * 実行環境（PCブラウザ vs モバイルブラウザ/アプリ）に応じたツールの最大受入枚数を取得する
 * @param {string} toolId
 * @returns {number}
 */
function getToolMaxFiles(toolId) {
  const item = OCTOPUS_NAV_ITEMS.find(t => t.id === toolId);
  if (!item) return 1;

  const isMobile = !!window.AndroidBridge || 
                   /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                   (window.innerWidth <= 768);

  return isMobile ? item.maxFilesMobile : item.maxFilesPC;
}

/**
 * 現在のページ内にある上限枚数表示要素を、アクセス環境に応じた数値へ自動更新する
 * @param {string} toolId
 */
function updateToolMaxFilesUI(toolId) {
  const max = getToolMaxFiles(toolId);
  document.querySelectorAll('[data-octopus-max-files]').forEach(el => {
    el.textContent = max.toLocaleString();
  });
}

(function() {
    // --------------------------------------------------
    // A. ページ判定（ファイル名またはURLから自動判別）
    // --------------------------------------------------
    function getCurrentPageKey() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("exifanalyzer")) return "analyzer";
        if (path.includes("photoprocess")) return "photoprocess";
        if (path.includes("exifviewedit")) return "viewedit";
        if (path.includes("exifcleaner")) return "cleaner";
        if (path.includes("exifframe")) return "exif";
        if (path.includes("mosaicblur")) return "mosaic";
        return "index";
    }

    // --------------------------------------------------
    // B. テーマ（ダークモード）制御
    // --------------------------------------------------
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

    // --------------------------------------------------
    // C. PCワイド表示制御
    // --------------------------------------------------
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

    // --------------------------------------------------
    // D. 共通アコーディオン開閉制御
    // --------------------------------------------------
    window.toggleAccordion = function(contentId, headerEl) {
        const content = document.getElementById(contentId);
        if (!content) return;
        content.classList.toggle('open');
        const span = headerEl ? headerEl.querySelector('span') : null;
        if (span) {
            span.textContent = content.classList.contains('open') ? '▲' : '▼';
        }
    };

    // --------------------------------------------------
    // E. DOMContentLoaded 初期化処理
    // --------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        const currentKey = getCurrentPageKey();
        const toolInfo = OCTOPUS_APP_INFO.tools[currentKey];

        // 1. バージョン表示および詳細ツールチップの反映
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

        // 2. 共通グローバルナビゲーションの自動生成（メニュー除外 ＆ order順ソート）
        const navContainer = document.getElementById("global-nav");
        if (navContainer) {
            navContainer.className = "global-nav";
            navContainer.setAttribute("aria-label", "ツール切り替え");
            navContainer.innerHTML = OCTOPUS_NAV_ITEMS
                .filter(item => item.id !== "menu")
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map(item => {
                    const isActive = item.id === currentKey ? " active" : "";
                    return `<a href="${item.url}" class="nav-item${isActive}"><span>${item.icon}</span> ${item.name}</a>`;
                }).join("");
        }

        // 3. テーマ切り替えボタンの初期化
        initThemeToggle();

        // 4. ワイド表示切り替えの初期化
        initWideModeToggle(currentKey);

        // 5. 上限枚数のUI自動反映
        if (currentKey !== "index" && currentKey !== "menu") {
            updateToolMaxFilesUI(currentKey);
        }
    });
})();