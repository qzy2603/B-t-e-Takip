const STORAGE_KEY = 'homeBudgetTracker_v8';

// --- CORE DATA STRUCTURE ---
const CORE = {
    accounts: [{ id: 1, name: "Ana Hesap", balance: 0, previousMonthBalance: 0 }],
    transactions: [],
    categories: {
        'Konut': { type: 'needs', subs: ['Kira/Mortgage', 'Aidat', 'Ev Bakım/Onarım'] },
        'Faturalar': { type: 'needs', subs: ['Elektrik', 'Su', 'Doğalgaz', 'İnternet/TV', 'Cep Telefonu'] },
        'Gıda & Market': { type: 'needs', subs: ['Market', 'Kasap/Manav', 'Temel İhtiyaçlar'] },
        'Ulaşım': { type: 'needs', subs: ['Yakıt', 'Toplu Taşıma', 'Araç Bakım/Sigorta'] },
        'Eğitim & Sağlık': { type: 'needs', subs: ['Okul Ücreti', 'Eğitim Malzemeleri', 'Doktor/İlaç', 'Sigorta'] },

        'Dışarıda Yeme': { type: 'wants', subs: ['Restoran', 'Kafe/Bar', 'Fast Food'] },
        'Giyim & Kişisel Bakım': { type: 'wants', subs: ['Kıyafet/Ayakkabı', 'Kozmetik/Kuaför', 'Spor Salonu Üyeliği'] },
        'Eğlence & Hobi': { type: 'wants', subs: ['Sinema/Konser', 'Kitap/Oyun', 'Tatil Harcaması'] },

        'Yatırım': { type: 'savings', subs: ['Hisse Senedi Alımı', 'Kripto Para', 'Altın/Gümüş', 'Fon Alımı'] },
        'Tasarruf Hesabı': { type: 'savings', subs: ['Acil Durum Fonu', 'Uzun Vadeli Hedef'] },

        'Maaş & Gelir': { type: 'income', subs: ['Aylık Maaş', 'Ek İş Geliri', 'Kira Geliri', 'Yatırım Satış Karı'] }
    },
    rates: { needs: 50, wants: 30, savings: 20 },
    bills: [], // Tekrarlayan ödemeler (Bills)
    portfolio: [], // Portföy Varlıkları
    
    // Uygulama Durumları
    currentPage: 'Dashboard',
    transactionFilter: 'paid', 
    currentReportMonth: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'),
    isDarkMode: false,
    snoozeMode: false,
};

// --- TEST VERİLERİ (GÜNCELLENMİŞ VE ÇOĞALTILMIŞ TEST DATASI) ---
const today = new Date();
const currentMonthYear = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
const previousMonthYear = today.getMonth() === 0 
    ? (today.getFullYear() - 1) + '-12' 
    : today.getFullYear() + '-' + String(today.getMonth()).padStart(2, '0');

CORE.bills = [
     { id: 101, title: 'Ev Kirası', amount: 18000, dueDate: 1, frequency: 'monthly', mainCategory: 'Konut', subCategory: 'Kira/Mortgage' },
     { id: 102, title: 'Netflix Aboneliği', amount: 150, dueDate: 15, frequency: 'monthly', mainCategory: 'Eğlence & Hobi', subCategory: 'Kitap/Oyun' },
     { id: 103, title: 'Elektrik Faturası', amount: 950, dueDate: 20, frequency: 'monthly', mainCategory: 'Faturalar', subCategory: 'Elektrik' },
     { id: 104, title: 'Su Faturası', amount: 300, dueDate: 25, frequency: 'monthly', mainCategory: 'Faturalar', subCategory: 'Su' },
     { id: 105, title: 'Araç Sigortası', amount: 5000, dueDate: 28, frequency: 'yearly', mainCategory: 'Ulaşım', subCategory: 'Araç Bakım/Sigorta' }
];

CORE.transactions = [
    // Geçen Ayın Verileri (Previous Month)
    { id: 1, date: `${previousMonthYear}-01`, type: 'income', amount: 30000, mainCategory: 'Maaş & Gelir', subCategory: 'Aylık Maaş', note: 'Geçen Ay Maaş Ödemesi', status: 'paid' },
    { id: 2, date: `${previousMonthYear}-10`, type: 'expense', amount: 18000, mainCategory: 'Konut', subCategory: 'Kira/Mortgage', note: 'Geçen Ay Kira', status: 'paid' },
    { id: 3, date: `${previousMonthYear}-15`, type: 'expense', amount: 1000, mainCategory: 'Giyim & Kişisel Bakım', subCategory: 'Kıyafet/Ayakkabı', note: 'Ayakkabı alımı', status: 'paid' },
    { id: 4, date: `${previousMonthYear}-30`, type: 'expense', amount: 500, mainCategory: 'Dışarıda Yeme', subCategory: 'Restoran', note: 'Akşam Yemeği', status: 'paid' },

    // Geçen ay bakiye hesaplaması için önceki ayın net bakiyesini manuel set edelim (Basitlik için)
    // Geçen Ay Net: 30000 - 18000 - 1000 - 500 = 10500 TL
    
    // Bu Ayın Verileri (Current Month)
    // Gelir
    { id: 10, date: `${currentMonthYear}-05`, type: 'income', amount: 35000, mainCategory: 'Maaş & Gelir', subCategory: 'Aylık Maaş', note: 'Bu Ay Maaş', status: 'paid' },
    { id: 11, date: `${currentMonthYear}-10`, type: 'income', amount: 5000, mainCategory: 'Maaş & Gelir', subCategory: 'Ek İş Geliri', note: 'Freelance', status: 'paid' },
    
    // Giderler (Paid)
    { id: 20, date: `${currentMonthYear}-01`, type: 'expense', amount: 18000, mainCategory: 'Konut', subCategory: 'Kira/Mortgage', note: 'Kira Ödendi', status: 'paid' },
    { id: 21, date: `${currentMonthYear}-03`, type: 'expense', amount: 1500, mainCategory: 'Gıda & Market', subCategory: 'Market', note: 'Haftalık Market', status: 'paid' },
    { id: 22, date: `${currentMonthYear}-15`, type: 'expense', amount: 150, mainCategory: 'Eğlence & Hobi', subCategory: 'Kitap/Oyun', note: 'Netflix', status: 'paid' },
    
    // Giderler (Pending - Beklemede)
    { id: 30, date: `${currentMonthYear}-20`, type: 'expense', amount: 950, mainCategory: 'Faturalar', subCategory: 'Elektrik', note: 'Elektrik Beklemede', status: 'pending' },
    { id: 31, date: `${currentMonthYear}-22`, type: 'expense', amount: 500, mainCategory: 'Dışarıda Yeme', subCategory: 'Restoran', note: 'Pizza Siparişi', status: 'pending' },
    
    // Giderler (Unpaid - Ödenmedi)
    { id: 40, date: `${currentMonthYear}-25`, type: 'expense', amount: 300, mainCategory: 'Faturalar', subCategory: 'Su', note: 'Su Faturası', status: 'unpaid' },
    { id: 41, date: `${currentMonthYear}-28`, type: 'expense', amount: 5000, mainCategory: 'Ulaşım', subCategory: 'Araç Bakım/Sigorta', note: 'Sigorta', status: 'unpaid' },
    
    // Yatırım İşlemleri (Tasarruf)
    { id: 50, date: `${currentMonthYear}-12`, type: 'expense', amount: 6000, mainCategory: 'Yatırım', subCategory: 'Kripto Para', note: 'BTC Alımı', status: 'paid', investment: { name: 'BTC', quantity: 0.01, price: 600000 } },
    { id: 51, date: `${currentMonthYear}-18`, type: 'expense', amount: 1000, mainCategory: 'Tasarruf Hesabı', subCategory: 'Acil Durum Fonu', note: 'Fona para aktarımı', status: 'paid' }
];

// Portföyü test verisiyle dolduralım
CORE.portfolio = [
     { name: 'BTC', quantity: 0.01, avgPrice: 600000, currentPrice: 650000, totalCost: 6000, purchaseDate: `${currentMonthYear}-12`, id: 201 }
];

// ---------------------------------------------------

// --- YARDIMCI FONKSİYONLAR (UTILS) ---
const Utils = {
    // Verileri Local Storage'dan yükler
    loadData: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            if (data.transactions && data.transactions.length > 0) {
                 // Sadece test verisi girilmişse, mevcut veriyi koru. Değilse, local veriyi kullan.
                 CORE.accounts = data.accounts || CORE.accounts;
                 CORE.transactions = data.transactions;
                 CORE.categories = data.categories || CORE.categories;
                 CORE.rates = data.rates || CORE.rates;
                 CORE.bills = data.bills || CORE.bills;
                 CORE.portfolio = data.portfolio || CORE.portfolio;
            }
            
            CORE.isDarkMode = data.isDarkMode || CORE.isDarkMode;
            CORE.snoozeMode = data.snoozeMode || CORE.snoozeMode;
            CORE.transactionFilter = data.transactionFilter || 'paid'; 
        } else {
             // Eğer local storage boşsa, test verilerini kaydedelim.
             Utils.saveData(); 
        }
        Utils.applyDarkMode();
        Utils.applySnoozeMode();
    },
    // Verileri Local Storage'a kaydeder
    saveData: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(CORE));
    },
    // Tarih formatını standartlaştırır
    parseDate: (dateString) => {
        // YYYY-MM-DD formatını doğru parse etmek için T00:00:00 eklenir
        return new Date(dateString + 'T00:00:00');
    },
    // Sayı formatını TL'ye çevirir
    formatCurrency: (amount) => {
        if (typeof amount !== 'number') return '0,00 TL';
        return amount.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },
    // Koyu modu uygular
    applyDarkMode: () => {
        document.body.classList.toggle('dark-mode', CORE.isDarkMode);
        document.getElementById('navDarkMode').querySelector('i').className = CORE.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    },
    // Koyu modu açıp kapatır
    toggleDarkMode: () => {
        CORE.isDarkMode = !CORE.isDarkMode;
        Utils.applyDarkMode();
        Utils.saveData();
    },
    // Rakam Gizleme modunu uygular
    applySnoozeMode: () => {
        document.body.classList.toggle('snooze-mode', CORE.snoozeMode);
        const snoozeBtn = document.getElementById('snoozeBtnText');
        if (snoozeBtn) {
           snoozeBtn.textContent = CORE.snoozeMode ? 'Rakamları Göster' : 'Rakamları Gizle';
        }
    },
    // Rakam Gizleme modunu açıp kapatır
    toggleSnoozeMode: () => {
        CORE.snoozeMode = !CORE.snoozeMode;
        Utils.applySnoozeMode();
        Utils.saveData();
        App.renderPage();
    },
    // Kural tipini (needs/wants/savings) Türkçe'ye çevirir
    translateUsageType: (type) => {
        const map = {
            'needs': 'İhtiyaç',
            'wants': 'Keyfi Harcama',
            'savings': 'Tasarruf',
            'income': 'Gelir',
            'investment': 'Yatırım'
        };
        return map[type] || type;
    },
    // Türkçe kategori isminden kural tipini (needs/wants/savings) bulur
    getCategoryUsageType: (mainCategoryName) => {
        const category = CORE.categories[mainCategoryName];
        return category ? category.type : null;
    },
    // YYYY-MM formatından önceki ayı döndürür
    getPreviousMonth: (currentMonthYear) => {
        const [year, month] = currentMonthYear.split('-').map(Number);
        if (month === 1) {
            return (year - 1) + '-12';
        }
        return year + '-' + String(month - 1).padStart(2, '0');
    }
};

// --- UYGULAMA ANA KONTROL FONKSİYONLARI (APP) ---
const App = {
    // Uygulama başlangıcı
    init: () => {
        Utils.loadData();
        App.setupListeners();
        App.calculateAllBalances(); // Tüm bakiye hesaplamalarını başlat
        App.renderPage();
    },
    // Olay Dinleyicileri Kurulumu
    setupListeners: () => {
        document.getElementById('transactionForm').addEventListener('submit', DashboardModule.saveTransaction);
        App.populateCategorySelects();
        document.getElementById('date').valueAsDate = new Date();
    },
    // Sayfa değiştirme
    showPage: (pageName) => {
        CORE.currentPage = pageName;
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById(`page${pageName}`).classList.add('active');

        document.querySelectorAll('.app-nav button').forEach(b => b.classList.remove('active'));
        document.getElementById(`nav${pageName}`).classList.add('active');
        
        document.getElementById('appHeaderTitle').textContent = `Ev Bütçe Takibi 💸 - ${App.getPageTitle(pageName)}`;

        App.renderPage();
        Utils.saveData();
    },
    // Sayfa başlıklarını Türkçe döndürür
    getPageTitle: (pageName) => {
        const titles = {
            'Dashboard': 'Ana Sayfa',
            'Reports': 'Raporlar',
            'Bills': 'Tekrarlayan Ödemeler',
            'Portfolio': 'Yatırım Portföyü',
            'Management': 'Yönetim Ayarları'
        };
        return titles[pageName] || pageName;
    },
    // Ana render fonksiyonu
    renderPage: () => {
        App.calculateAllBalances(); // Bakiye, gelir, gider, devir hesaplanır
        DashboardModule.renderBalanceSummary(); 
        
        switch (CORE.currentPage) {
            case 'Dashboard':
                DashboardModule.renderTransactionList(); 
                BillsModule.renderBillStatusSummary(); // Yeni özet
                BillsModule.checkOverdueBills(); 
                break;
            case 'Reports':
                ReportModule.renderReport();
                break;
            case 'Bills':
                BillsModule.renderBillList(); // Yeni işlevselliği olan fatura listesi
                break;
            case 'Portfolio':
                PortfolioModule.renderPortfolioSummary();
                PortfolioModule.renderPortfolioList();
                break;
            case 'Management':
                ManagementModule.renderManagementPage();
                break;
        }
        App.populateCategorySelects();
    },
    // Kategori dropdown'larını doldurur
    populateCategorySelects: (currentMainCategory, currentSubCategory) => {
        const mainSelects = [
            document.getElementById('mainCategory'),
            document.getElementById('mainCategorySelectBill')
        ];
        
        mainSelects.forEach(select => {
            if (!select) return;
            
            select.innerHTML = '<option value="" disabled selected>Kategori Seçin</option>';

            Object.keys(CORE.categories).forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                if (cat === currentMainCategory) option.selected = true;
                select.appendChild(option);
            });
        });

        App.handleCategoryChange(currentMainCategory, currentSubCategory);
    },
    // Kategori değişince alt kategorileri günceller
    handleCategoryChange: (mainCategory = document.getElementById('mainCategory')?.value, subCategory) => {
        const subSelect = document.getElementById('subCategory');
        const investmentFields = document.getElementById('investmentFields');
        const normalAmountLabel = document.getElementById('normalAmountLabel');
        
        if (!subSelect) return;
        
        subSelect.innerHTML = '<option value="" disabled selected>Alt Kategori Seçin</option>';

        if (mainCategory && CORE.categories[mainCategory]) {
            CORE.categories[mainCategory].subs.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                if (sub === subCategory) option.selected = true;
                subSelect.appendChild(option);
            });

            const type = Utils.getCategoryUsageType(mainCategory);
            const isInvestment = type === 'savings' && mainCategory === 'Yatırım'; 
            
            investmentFields.style.display = isInvestment ? 'flex' : 'none';
            normalAmountLabel.style.display = isInvestment ? 'none' : 'block';
            document.getElementById('amount').required = !isInvestment;
            document.getElementById('investmentName').required = isInvestment;
            document.getElementById('investmentQuantity').required = isInvestment;
            document.getElementById('investmentPrice').required = isInvestment;
        }
    },
    // İşlem tipini ayarlar (Gider/Gelir butonları için)
    setTransactionType: (type) => {
        document.getElementById('type').value = type;
        document.getElementById('btnExpense').classList.toggle('active', type === 'expense');
        document.getElementById('btnIncome').classList.toggle('active', type === 'income');
        
        // Gelir seçilince Gelir kategorisine yönlendir
        if (type === 'income') {
            const incomeCat = Object.keys(CORE.categories).find(key => CORE.categories[key].type === 'income');
            if (incomeCat) {
                document.getElementById('mainCategory').value = incomeCat;
                App.handleCategoryChange(incomeCat);
            }
        } else {
             document.getElementById('mainCategory').value = 'Konut';
             App.handleCategoryChange('Konut');
        }
    },
    // Tüm bakiye, gelir, gider ve devir hesaplamalarını yapar (En kritik fonksiyon)
    calculateAllBalances: () => {
        const today = new Date();
        const currentMonthYear = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
        const previousMonthYear = Utils.getPreviousMonth(currentMonthYear);

        let currentMonthIncome = 0;
        let currentMonthExpense = 0; // Sadece paid giderler
        let totalCashBalance = 0;
        let previousMonthNetCash = 0;

        CORE.transactions.forEach(t => {
            const dateMonthYear = t.date.substring(0, 7);
            const amount = parseFloat(t.amount || 0);
            const isCashTransaction = !(Utils.getCategoryUsageType(t.mainCategory) === 'savings' && t.mainCategory === 'Yatırım');
            
            // Sadece ödenmiş (paid) nakit işlemleri bakiye ve gelir/gideri etkiler
            if (t.status === 'paid' && isCashTransaction) {
                if (t.type === 'income') {
                    totalCashBalance += amount;
                    if (dateMonthYear === currentMonthYear) {
                        currentMonthIncome += amount;
                    }
                    if (dateMonthYear === previousMonthYear) {
                         previousMonthNetCash += amount;
                    }
                } else if (t.type === 'expense') {
                    totalCashBalance -= amount;
                    if (dateMonthYear === currentMonthYear) {
                        currentMonthExpense += amount;
                    }
                    if (dateMonthYear === previousMonthYear) {
                         previousMonthNetCash -= amount;
                    }
                }
            }
        });

        // 1. Nakit Bakiye Hesaplaması
        const mainAccount = CORE.accounts.find(a => a.id === 1);
        if (mainAccount) {
            mainAccount.balance = totalCashBalance; // Tüm zamanların kümülatif bakiyesi
            mainAccount.currentMonthIncome = currentMonthIncome;
            mainAccount.currentMonthExpense = currentMonthExpense;
            mainAccount.previousMonthNetCash = previousMonthNetCash;
            // Kalan Bakiye = Önceki Aydan Devir + Bu Ay Gelir - Bu Ay Gider
            mainAccount.remainingCash = previousMonthNetCash + currentMonthIncome - currentMonthExpense;
        }

        // 2. Portföy ve Net Varlık Hesaplaması
        let totalPortfolioValue = PortfolioModule.calculateTotalPortfolioValue();
        CORE.netWorth = totalCashBalance + totalPortfolioValue;
    }
};

// --- MODÜL: DASHBOARD (ANA SAYFA) ---
const DashboardModule = {
    // Yeni ve detaylı bakiye özetini render eder
    renderBalanceSummary: () => {
        const account = CORE.accounts.find(a => a.id === 1);
        const cashBalance = account.balance;
        const currentMonthIncome = account.currentMonthIncome;
        const currentMonthExpense = account.currentMonthExpense;
        const previousMonthBalance = account.previousMonthNetCash; // Geçen ayın sonu (Bu aya devir)
        const remainingCash = previousMonthBalance + currentMonthIncome - currentMonthExpense; // Kalan (Devir+Gelir-Gider)

        const portfolioValue = PortfolioModule.calculateTotalPortfolioValue();
        const totalCost = CORE.portfolio.reduce((sum, asset) => sum + asset.totalCost, 0);
        const netWorth = CORE.netWorth;

        const html = `
            <div class="balance-details">
                <div style="grid-column: 1 / span 2; border: 2px solid var(--primary-color);">
                    <p>Genel Nakit Bakiye (Kümülatif)</p>
                    <span class="balance-amount ${cashBalance >= 0 ? 'gain' : 'loss'}">${Utils.formatCurrency(cashBalance)}</span>
                </div>
                
                <div>
                    <p>Bu Ay Toplam Gelir (Paid)</p>
                    <span class="balance-amount gain">${Utils.formatCurrency(currentMonthIncome)}</span>
                </div>
                <div>
                    <p>Bu Ay Toplam Gider (Paid)</p>
                    <span class="balance-amount loss">${Utils.formatCurrency(currentMonthExpense)}</span>
                </div>

                <div>
                    <p>Geçen Aydan Devreden Bakiye</p>
                    <span class="balance-amount">${Utils.formatCurrency(previousMonthBalance)}</span>
                </div>
                <div>
                    <p>AYLIK NET KALAN (Devir + Gelir - Gider)</p>
                    <span class="balance-amount ${remainingCash >= 0 ? 'gain' : 'loss'}">${Utils.formatCurrency(remainingCash)}</span>
                </div>
                
                <div>
                    <p>Portföy Ana Para (Maliyet)</p>
                    <span class="balance-amount">${Utils.formatCurrency(totalCost)}</span>
                </div>
                <div>
                    <p>Portföy Tüm Bakiye (Piyasa Değeri)</p>
                    <span class="balance-amount">${Utils.formatCurrency(portfolioValue)}</span>
                </div>
                
                <div class="total-net" style="grid-column: 1 / span 2; background-color: var(--secondary-color); color: var(--text-color-light);">
                    <p style="color: var(--text-color-light); font-weight: bold;">GENEL NET VARLIK (Nakit + Portföy)</p>
                    <span class="balance-amount" style="color: var(--text-color-light);">${Utils.formatCurrency(netWorth)}</span>
                </div>
            </div>
        `;
        document.getElementById('balanceSummaryCard').innerHTML = `<h3>🏦 Genel Varlık Durumu</h3>${html}`;
    },
    // Yeni işlem kaydeder
    saveTransaction: (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const type = formData.get('type');
        const mainCategory = formData.get('mainCategory');
        const status = formData.get('status');
        
        let newTransaction = {
            id: Date.now(),
            date: formData.get('date'),
            type: type,
            mainCategory: mainCategory,
            subCategory: formData.get('subCategory'),
            note: formData.get('note'),
            status: status || 'unpaid',
        };

        const categoryType = Utils.getCategoryUsageType(mainCategory);

        if (categoryType === 'savings' && mainCategory === 'Yatırım') {
            // YATIRIM İŞLEMİ MANTIĞI
            const quantity = parseFloat(formData.get('investmentQuantity'));
            const price = parseFloat(formData.get('investmentPrice'));
            const name = formData.get('investmentName');
            const amount = quantity * price; // Toplam maliyet
            
            if (!quantity || !price || !name) {
                alert("Lütfen tüm yatırım alanlarını (Adı, Miktar, Birim Fiyat) doldurun.");
                return;
            }

            newTransaction.amount = amount;
            newTransaction.investment = {
                name: name,
                quantity: quantity,
                price: price, 
            };

            // Yatırım işlemi her zaman portföyü etkiler.
            PortfolioModule.addOrUpdateInvestment(newTransaction);
        } else {
            // NORMAL İŞLEM MANTIĞI
            const amount = parseFloat(formData.get('amount'));
            if (isNaN(amount) || amount <= 0) {
                alert("Lütfen geçerli bir miktar girin.");
                return;
            }
            newTransaction.amount = amount;
        }

        CORE.transactions.push(newTransaction);
        
        Utils.saveData();
        form.reset();
        App.setTransactionType('expense'); 
        document.getElementById('date').valueAsDate = new Date(); 
        App.handleCategoryChange();
        App.renderPage(); // Tüm bakiyeleri yeniden hesaplar ve render eder
    },
    // İşlem listesini render eder (Ödenmiş, ödenmemiş, beklemede filtrelemesine göre)
    renderTransactionList: () => {
        const listEl = document.getElementById('transactionList');
        if (!listEl) return;
        
        let filteredTransactions = CORE.transactions.filter(t => t.status === CORE.transactionFilter);
        
        // İşlem listesi geri eklendi ve filtrelenmiş şekilde çalışıyor.
        filteredTransactions.sort((a, b) => Utils.parseDate(b.date).getTime() - Utils.parseDate(a.date).getTime());
        
        listEl.innerHTML = '';

        if (filteredTransactions.length === 0) {
            let filterText = CORE.transactionFilter === 'pending' ? 'Beklemede' : (CORE.transactionFilter === 'unpaid' ? 'Ödenmemiş' : 'Ödenmiş');

            listEl.innerHTML = `<li style="text-align: center; color: #666; padding: 20px;">
                ${filterText} işleme uyan kayıt bulunamadı.
                </li>`;
            DashboardModule.updateFilterButtons(CORE.transactionFilter);
            return;
        }

        let listTitle = "🧾 Son İşlemler";
        if (CORE.transactionFilter === 'paid') listTitle = "🧾 Ödenmiş Son İşlemler";
        else if (CORE.transactionFilter === 'unpaid') listTitle = "🧾 Ödenmemiş İşlemler";
        else if (CORE.transactionFilter === 'pending') listTitle = "🧾 Beklemede Olan İşlemler";
        
        document.getElementById('transactionsListCard').querySelector('h3').textContent = listTitle;


        filteredTransactions.forEach(t => {
            const isLoss = t.type === 'expense';
            const amountClass = isLoss ? 'loss' : 'gain';
            const icon = isLoss ? 'minus' : 'plus';
            
            let statusText = '';
            let statusClass = '';
            if (t.status === 'paid') {
                statusText = ' (Ödendi)';
                statusClass = 'paid-status';
            } else if (t.status === 'unpaid') {
                statusText = ' (Ödenmedi)';
                statusClass = 'unpaid-status';
            } else if (t.status === 'pending') {
                statusText = ' (Beklemede)';
                statusClass = 'pending';
            }

            const investmentInfo = t.investment ? ` (${t.investment.name})` : '';

            const li = document.createElement('li');
            li.className = 'transaction-list-item';
            li.innerHTML = `
                <div class="transaction-details">
                    <span class="category"><i class="fas fa-${icon}-circle"></i> ${t.mainCategory}${investmentInfo}</span>
                    <span class="note">${t.subCategory} - ${t.note || ''}</span>
                    <span class="date">${t.date} <strong class="${statusClass}">${statusText}</strong></span>
                </div>
                <span class="transaction-amount ${amountClass} amount">${Utils.formatCurrency(t.amount)}</span>
                <div class="transaction-actions">
                    <button onclick="DashboardModule.editTransaction(${t.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                    <button onclick="DashboardModule.deleteTransaction(${t.id})" title="Sil"><i class="fas fa-trash"></i></button>
                </div>
            `;
            listEl.appendChild(li);
        });
        
        DashboardModule.updateFilterButtons(CORE.transactionFilter);
    },
    // Filtre butonlarının görünümünü günceller
    updateFilterButtons: (activeFilter) => {
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            btn.classList.remove('active');
            const btnFilter = btn.id.replace('filter', '').toLowerCase();
            if (btnFilter === activeFilter) {
                btn.classList.add('active');
            }
        });
    },
    // İşlem silme
    deleteTransaction: (id) => {
        if (!confirm('Bu işlemi silmek istediğinizden emin misiniz?')) return;
        
        const index = CORE.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            const transactionToDelete = CORE.transactions[index];
            
            // Portföyü geri al
            const categoryType = Utils.getCategoryUsageType(transactionToDelete.mainCategory);
            if (categoryType === 'savings' && transactionToDelete.mainCategory === 'Yatırım' && transactionToDelete.investment) {
                PortfolioModule.removeInvestment(transactionToDelete);
            }

            CORE.transactions.splice(index, 1);
            
            Utils.saveData();
            App.renderPage();
        }
    },
    // İşlem düzenleme (Placeholder)
    editTransaction: (id) => {
        alert(`İşlem ID: ${id} - Düzenleme modu yakında eklenecektir.`);
    },
    // Yeni filtre ayarlar
    setTransactionFilter: (filter) => {
        CORE.transactionFilter = filter;
        DashboardModule.renderTransactionList();
        Utils.saveData();
    }
};

// --- MODÜL: BILLS (TEKRARLAYAN ÖDEMELER) ---
const BillsModule = {
    // Ana sayfada fatura durum özetini render eder
    renderBillStatusSummary: () => {
        const today = new Date();
        const currentDay = today.getDate();
        
        let paidCount = 0;
        let pendingCount = 0;
        let overdueCount = 0;

        CORE.bills.forEach(bill => {
             // Basit kontrol: Fatura günü geçti mi?
            const isOverdue = bill.dueDate < currentDay;

            // Bu fatura bu ay ödendi mi? (Basit kontrol: status alanına bakalım. Gerçek uygulamada tüm transactions kontrol edilmeli)
            // Daha gelişmiş bir kontrol için, bu fatura için bu ay bir işlem kaydı var mı diye bakılmalı.
            const relatedTransaction = BillsModule.getRelatedTransaction(bill);

            if (relatedTransaction) {
                if (relatedTransaction.status === 'paid') {
                    paidCount++;
                } else if (relatedTransaction.status === 'pending') {
                    pendingCount++;
                } else if (relatedTransaction.status === 'unpaid' && isOverdue) {
                    overdueCount++;
                }
            } else {
                 // Henüz işlem kaydı yoksa
                 if (isOverdue) {
                     overdueCount++; // Gecikmiş varsayılır
                 } else {
                     pendingCount++; // Ödenecekler (Beklemede) varsayılır
                 }
            }
        });

        const summaryEl = document.getElementById('billStatusSummary');
        summaryEl.innerHTML = `
            <h3>📅 Tekrarlayan Ödeme Durumu (Bu Ay)</h3>
            <div style="display: flex; justify-content: space-around; text-align: center;">
                <div>
                    <p style="color: var(--success-color);">Ödendi</p>
                    <span class="paid-status">${paidCount}</span>
                </div>
                <div>
                    <p style="color: var(--warning-color);">Bekliyor/Ödenecek</p>
                    <span class="pending">${pendingCount}</span>
                </div>
                <div>
                    <p style="color: var(--danger-color);">Gecikti</p>
                    <span class="unpaid-status">${overdueCount}</span>
                </div>
            </div>
        `;
    },
    // Fatura listesini render eder (Durum butonları eklendi)
    renderBillList: () => {
        const listEl = document.getElementById('billListContainer');
        if (!listEl) return;
        
        // Sadece başlık satırını koru
        const header = listEl.querySelector('.bill-list-header');
        listEl.innerHTML = '';
        listEl.appendChild(header);

        if (CORE.bills.length === 0) {
            listEl.innerHTML += `<li style="text-align: center; color: #666; padding: 20px;">
                Tekrarlayan ödeme (fatura) bulunmamaktadır.
                </li>`;
            return;
        }

        CORE.bills.sort((a, b) => a.dueDate - b.dueDate); 

        CORE.bills.forEach(bill => {
            const today = new Date();
            const currentDay = today.getDate();
            const isOverdue = bill.dueDate < currentDay;

            // İlgili işlem kaydını bul (bu ay için)
            let relatedTransaction = BillsModule.getRelatedTransaction(bill);
            let currentStatus = relatedTransaction ? relatedTransaction.status : (isOverdue ? 'unpaid' : 'pending');

            // Eğer işlem kaydı yoksa ve ödeme günü geçmemişse "Beklemede" varsayılır.
            if (!relatedTransaction && !isOverdue) {
                 currentStatus = 'pending';
            } else if (!relatedTransaction && isOverdue) {
                 currentStatus = 'unpaid'; // İşlem yok ve gün geçmişse "Gecikti"
            }
            

            const statusText = {
                'paid': 'Ödendi',
                'pending': 'Bekliyor',
                'unpaid': 'Gecikti'
            };

            const li = document.createElement('li');
            li.className = 'bill-list-item';
            li.innerHTML = `
                <div class="bill-details">
                    <span class="bill-title">${bill.title}</span>
                    <span class="category">${bill.mainCategory} > ${bill.subCategory}</span>
                    <div style="margin-top: 5px;">
                        <button onclick="BillsModule.openBillModal('edit', ${bill.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                        <button onclick="BillsModule.deleteBill(${bill.id})" title="Sil"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="bill-amount-cell loss amount">${Utils.formatCurrency(bill.amount)}</div>
                <div class="bill-due-date-cell">
                    ${bill.dueDate}. Gün
                    <span style="font-size: 0.8em; display: block; color: ${isOverdue ? 'var(--danger-color)' : '#666'};">${isOverdue ? ' (Gecikti!)' : ''}</span>
                </div>
                <div class="bill-status-cell">
                    <button 
                        class="status-paid ${currentStatus === 'paid' ? 'active' : ''}" 
                        onclick="BillsModule.setBillStatus(${bill.id}, 'paid', ${bill.amount}, '${bill.mainCategory}', '${bill.subCategory}')">
                        ${statusText['paid']}
                    </button>
                    <button 
                        class="status-pending ${currentStatus === 'pending' ? 'active' : ''}" 
                        onclick="BillsModule.setBillStatus(${bill.id}, 'pending', ${bill.amount}, '${bill.mainCategory}', '${bill.subCategory}')">
                        ${statusText['pending']}
                    </button>
                    <button 
                        class="status-unpaid ${currentStatus === 'unpaid' ? 'active' : ''}" 
                        onclick="BillsModule.setBillStatus(${bill.id}, 'unpaid', ${bill.amount}, '${bill.mainCategory}', '${bill.subCategory}')">
                        ${currentStatus === 'unpaid' ? statusText['unpaid'] : 'Ödenmedi'}
                    </button>
                </div>
            `;
            listEl.appendChild(li);
        });
    },
    // Belirli bir fatura için bu aya ait işlem kaydını bulur
    getRelatedTransaction: (bill) => {
        const today = new Date();
        const currentMonthYear = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
        
        return CORE.transactions.find(t => 
            t.mainCategory === bill.mainCategory && 
            t.subCategory === bill.subCategory && 
            t.date.startsWith(currentMonthYear) && 
            Math.abs(t.amount - bill.amount) < 0.01 && // Aynı miktarda olması beklenir
            t.type === 'expense'
        );
    },
    // Faturanın durumunu ayarlar (İşlem kaydı oluşturur/günceller)
    setBillStatus: (billId, newStatus, amount, mainCategory, subCategory) => {
        const bill = CORE.bills.find(b => b.id === billId);
        if (!bill) return;

        let relatedTransaction = BillsModule.getRelatedTransaction(bill);

        if (relatedTransaction) {
            // İlgili işlem kaydı varsa, durumunu güncelle
            relatedTransaction.status = newStatus;
        } else {
            // İlgili işlem kaydı yoksa, yeni bir işlem kaydı oluştur
            relatedTransaction = {
                id: Date.now(),
                date: new Date().toISOString().substring(0, 10),
                type: 'expense',
                amount: amount,
                mainCategory: mainCategory,
                subCategory: subCategory,
                note: `${bill.title} (${newStatus === 'paid' ? 'Ödendi' : newStatus === 'pending' ? 'Bekliyor' : 'Ödenmedi'})`,
                status: newStatus,
            };
            CORE.transactions.push(relatedTransaction);
        }

        Utils.saveData();
        App.renderPage(); // Hem bakiye hem de fatura listesi güncellensin
    },
    // Gecikmiş fatura uyarısını kontrol eder
    checkOverdueBills: () => {
        const today = new Date();
        const currentDay = today.getDate();
        let overdueCount = 0;

        CORE.bills.forEach(bill => {
            const isOverdueDay = bill.dueDate < currentDay;

            if (isOverdueDay) {
                // Sadece ödenmemiş/beklemede olanları say
                const relatedTransaction = BillsModule.getRelatedTransaction(bill);
                if (!relatedTransaction || (relatedTransaction.status !== 'paid')) {
                    overdueCount++;
                }
            }
        });
        
        const alertEl = document.getElementById('overdueAlert');
        if (overdueCount > 0) {
            alertEl.style.display = 'flex';
            alertEl.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i> 
                                <strong>${overdueCount} adet tekrarlayan ödeme (fatura) gecikmiş olabilir.</strong> Kontrol edin!`;
        } else {
            alertEl.style.display = 'none';
        }
    },
    // Kategori değişince alt kategoriyi günceller (Modal için)
    handleCategoryChangeBill: (mainCategory = document.getElementById('mainCategorySelectBill').value, subCategory) => {
        const subSelect = document.getElementById('subCategorySelectBill');
        if (!subSelect) return;
        
        subSelect.innerHTML = '<option value="" disabled selected>Alt Kategori Seçin</option>';

        if (mainCategory && CORE.categories[mainCategory]) {
            CORE.categories[mainCategory].subs.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                if (sub === subCategory) option.selected = true;
                subSelect.appendChild(option);
            });
        }
    },
    // Faturayı kaydeder veya günceller
    saveBill: (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const mode = formData.get('billMode');
        const id = parseInt(formData.get('billId'));
        
        const newBill = {
            id: id || Date.now(),
            title: formData.get('billTitle'),
            amount: parseFloat(formData.get('billAmount')),
            dueDate: parseInt(formData.get('billDueDate')),
            frequency: formData.get('billFrequency'),
            mainCategory: formData.get('mainCategorySelectBill'),
            subCategory: formData.get('subCategorySelectBill'),
        };

        if (newBill.dueDate < 1 || newBill.dueDate > 31) {
            alert('Vade günü 1 ile 31 arasında olmalıdır.');
            return;
        }

        if (mode === 'add') {
            CORE.bills.push(newBill);
        } else if (mode === 'edit') {
            const index = CORE.bills.findIndex(b => b.id === id);
            if (index !== -1) {
                CORE.bills[index] = newBill;
            }
        }
        
        document.getElementById('billModal').style.display = 'none';
        Utils.saveData();
        App.renderPage();
    },
    // Faturayı siler
    deleteBill: (id) => {
        if (!confirm('Bu tekrarlayan ödemeyi silmek istediğinizden emin misiniz?')) return;
        
        const index = CORE.bills.findIndex(b => b.id === id);
        if (index !== -1) {
            CORE.bills.splice(index, 1);
            Utils.saveData();
            App.renderPage();
        }
    },
    // Fatura modalını açar (edit/add)
    openBillModal: (mode, id) => {
        // ... (Bu fonksiyon bir önceki versiyondan aynı kaldı)
        const modal = document.getElementById('billModal');
        const form = document.getElementById('billForm');
        form.reset();
        document.getElementById('billId').value = '';
        document.getElementById('billMode').value = mode;

        App.populateCategorySelects();
        
        if (mode === 'add') {
            document.getElementById('billModalTitle').textContent = 'Yeni Tekrarlayan Ödeme Ekle';
        } else if (mode === 'edit') {
            document.getElementById('billModalTitle').textContent = 'Tekrarlayan Ödeme Düzenle';
            const bill = CORE.bills.find(b => b.id === id);
            if (bill) {
                document.getElementById('billId').value = bill.id;
                document.getElementById('billTitle').value = bill.title;
                document.getElementById('billAmount').value = bill.amount;
                document.getElementById('billDueDate').value = bill.dueDate;
                document.getElementById('billFrequency').value = bill.frequency;
                document.getElementById('mainCategorySelectBill').value = bill.mainCategory;
                BillsModule.handleCategoryChangeBill(bill.mainCategory, bill.subCategory); 
            }
        }
        
        modal.style.display = 'block';
    }
};

// --- MODÜL: PORTFOLIO (Değişmedi) ---
const PortfolioModule = {
    // Portföy güncellemeleri
    addOrUpdateInvestment: (transaction) => {
         const { name, quantity, price } = transaction.investment;
        const totalCost = quantity * price;

        const existingAsset = CORE.portfolio.find(p => p.name === name);

        if (existingAsset) {
            const oldTotalCost = existingAsset.quantity * existingAsset.avgPrice;
            const newTotalCost = oldTotalCost + totalCost;
            existingAsset.quantity += quantity;
            existingAsset.avgPrice = newTotalCost / existingAsset.quantity;
            existingAsset.totalCost = newTotalCost;
        } else {
            CORE.portfolio.push({
                name: name,
                quantity: quantity,
                avgPrice: price,
                currentPrice: price, 
                totalCost: totalCost,
                purchaseDate: transaction.date,
                id: Date.now()
            });
        }
    },
    removeInvestment: (transaction) => {
        const { name, quantity } = transaction.investment;
        const index = CORE.portfolio.findIndex(p => p.name === name);
        
        if (index !== -1) {
            const asset = CORE.portfolio[index];
            if (asset.quantity > quantity) {
                asset.quantity -= quantity;
                asset.totalCost = asset.quantity * asset.avgPrice; 
            } else {
                CORE.portfolio.splice(index, 1);
            }
        }
    },
    calculateTotalPortfolioValue: () => {
        return CORE.portfolio.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
    },
    // Portföy özetini render eder
    renderPortfolioSummary: () => {
        const totalValue = PortfolioModule.calculateTotalPortfolioValue();
        const totalCost = CORE.portfolio.reduce((sum, asset) => sum + asset.totalCost, 0);
        const netProfitLoss = totalValue - totalCost;
        
        document.getElementById('totalPortfolioValue').textContent = Utils.formatCurrency(totalValue);
        document.getElementById('totalCost').textContent = Utils.formatCurrency(totalCost);
        document.getElementById('netProfitLoss').textContent = Utils.formatCurrency(netProfitLoss);
        document.getElementById('netProfitLoss').className = netProfitLoss >= 0 ? 'gain' : 'loss';
        
        document.getElementById('dailyChangeSum').textContent = Utils.formatCurrency(0);
        document.getElementById('dailyChangeSum').className = 'gain';
    },
    // Portföy varlık listesini render eder
    renderPortfolioList: () => {
        const listEl = document.getElementById('portfolioListContainer');
        if (!listEl) return;
        listEl.innerHTML = '';

        if (CORE.portfolio.length === 0) {
            listEl.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">
                Henüz Portföyde yatırım yok. Lütfen Ana Sayfadan 'Yatırım' kategorisi ile işlem ekleyin.
                </p>`;
            return;
        }

        CORE.portfolio.forEach(asset => {
            const currentValue = asset.quantity * asset.currentPrice;
            const profitLoss = currentValue - asset.totalCost;
            const profitLossClass = profitLoss >= 0 ? 'gain' : 'loss';
            const percentageChange = asset.totalCost > 0 ? ((profitLoss / asset.totalCost) * 100).toFixed(2) : 0;
            
            const div = document.createElement('div');
            div.className = 'portfolio-list-item';
            div.innerHTML = `
                <div class="portfolio-details">
                    <span class="symbol">${asset.name} (${asset.quantity.toFixed(4)} Adet)</span>
                    <span class="quantity">Maliyet: ${Utils.formatCurrency(asset.totalCost)}</span>
                    <span class="quantity">Ort. Fiyat: ${Utils.formatCurrency(asset.avgPrice)}</span>
                </div>
                <div style="text-align: right;">
                    <span style="display: block; font-weight: bold; font-size: 1.1em;" class="amount">${Utils.formatCurrency(currentValue)}</span>
                    <span class="${profitLossClass}" style="font-size: 0.9em;">${Utils.formatCurrency(profitLoss)} (%${percentageChange})</span>
                </div>
            `;
            listEl.appendChild(div);
        });
    },
    openManualUpdateModal: () => {
        const container = document.getElementById('priceUpdateInputs');
        container.innerHTML = '';

        if (CORE.portfolio.length === 0) {
            container.innerHTML = '<p>Portföyde güncellenecek varlık bulunamadı.</p>';
        } else {
            CORE.portfolio.forEach(asset => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <label>${asset.name} (Mevcut: ${Utils.formatCurrency(asset.currentPrice)})
                        <input type="number" step="0.0001" name="${asset.name}" value="${asset.currentPrice}" placeholder="Yeni Birim Fiyat (TL)" required>
                    </label>
                `;
                container.appendChild(div);
            });
        }

        document.getElementById('manualPriceUpdateModal').style.display = 'block';
    },
    updateInvestmentPrices: (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        let updated = false;

        CORE.portfolio.forEach(asset => {
            const newPrice = parseFloat(formData.get(asset.name));
            if (!isNaN(newPrice) && newPrice !== asset.currentPrice) {
                asset.currentPrice = newPrice;
                updated = true;
            }
        });

        if (updated) {
            Utils.saveData();
            App.renderPage();
            alert('Fiyatlar başarıyla güncellendi.');
        } else {
            alert('Hiçbir fiyat değişikliği yapılmadı.');
        }

        document.getElementById('manualPriceUpdateModal').style.display = 'none';
    }
};

// --- MODÜL: REPORTS (Değişmedi) ---
let chartInstances = {};
const ReportModule = { /* ... (Rapor modülü olduğu gibi korunmuştur) ... */ 
    changeReportMonth: (delta) => {
        const [year, month] = CORE.currentReportMonth.split('-').map(Number);
        let newMonth = month + delta;
        let newYear = year;

        if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        }
        
        CORE.currentReportMonth = newYear + '-' + String(newMonth).padStart(2, '0');
        ReportModule.renderReport();
        Utils.saveData();
    },
    renderReport: () => {
        const currentDate = new Date();
        const [reportYear, reportMonth] = CORE.currentReportMonth.split('-').map(Number);
        
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        document.getElementById('reportMonthDisplay').textContent = `${monthNames[reportMonth - 1]} ${reportYear} Raporu`;
        
        const isFutureMonth = reportYear > currentDate.getFullYear() || 
                              (reportYear === currentDate.getFullYear() && reportMonth > currentDate.getMonth() + 1);
        document.getElementById('nextReportMonthBtn').disabled = isFutureMonth;

        const monthlyTransactions = CORE.transactions.filter(t => {
            const date = Utils.parseDate(t.date);
            return date.getFullYear() === reportYear && date.getMonth() + 1 === reportMonth;
        });

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income' && t.status === 'paid')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        ReportModule.calculateAndRender503020(monthlyTransactions, monthlyIncome);
        ReportModule.renderIncomeExpenseChart(monthlyTransactions);
        ReportModule.renderCategoryDistributionChart(monthlyTransactions);
    },
    calculateAndRender503020: (transactions, totalIncome) => {
        const totals = { needs: 0, wants: 0, savings: 0, income: totalIncome };
        
        transactions
            .filter(t => t.type === 'expense' && t.status === 'paid')
            .forEach(t => {
                const type = Utils.getCategoryUsageType(t.mainCategory);
                if (type && totals[type] !== undefined) {
                    totals[type] += parseFloat(t.amount);
                }
            });
        
        const rates = CORE.rates;
        const tableBody = document.getElementById('ruleChartTable');
        const adviceBox = document.getElementById('ruleAdvice');
        
        tableBody.innerHTML = '';
        
        if (totalIncome === 0) {
            adviceBox.textContent = 'Bu ay geliriniz 0 TL. Analiz yapmak için gelir eklemelisiniz.';
            tableBody.innerHTML = '';
            return;
        }

        let overallAdvice = [];
        
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Kural Türü</th>
                        <th>Harcama (TL)</th>
                        <th>Oran (%)</th>
                        <th>Hedef (%)</th>
                        <th>Durum</th>
                    </tr>
                </thead>
                <tbody>
                    ${['needs', 'wants', 'savings'].map(key => {
                        const amount = totals[key];
                        const actualRate = (amount / totalIncome) * 100;
                        const targetRate = rates[key];
                        let status = '';
                        let statusIcon = '';
                        let rowClass = '';

                        if (key === 'savings') {
                            if (actualRate >= targetRate) {
                                status = 'Başarılı';
                                statusIcon = '✅';
                                rowClass = 'gain';
                            } else {
                                status = 'Eksik';
                                statusIcon = '❌';
                                rowClass = 'loss';
                                overallAdvice.push(`Tasarruf hedefinizin %${(targetRate - actualRate).toFixed(2)} altında kaldınız. (${Utils.formatCurrency(totalIncome * (targetRate / 100) - amount)} eksik)`);
                            }
                        } else {
                            if (actualRate <= targetRate) {
                                status = 'Başarılı';
                                statusIcon = '✅';
                                rowClass = 'gain';
                            } else {
                                status = 'Aşıldı';
                                statusIcon = '⚠️';
                                rowClass = 'loss';
                                overallAdvice.push(`${Utils.translateUsageType(key)} hedefinizi %${(actualRate.toFixed(2) - targetRate).toFixed(2)} aştınız.`);
                            }
                        }

                        return `
                            <tr class="${rowClass}">
                                <td>${Utils.translateUsageType(key)}</td>
                                <td>${Utils.formatCurrency(amount)}</td>
                                <td>%${actualRate.toFixed(2)}</td>
                                <td>%${targetRate}</td>
                                <td>${statusIcon} ${status}</td>
                            </tr>
                        `;
                    }).join('')}
                    <tr>
                        <th colspan="5" style="text-align: center; background-color: var(--warning-color); color: #333;">Aylık Gelir: ${Utils.formatCurrency(totalIncome)}</th>
                    </tr>
                </tbody>
            </table>
        `;
        
        tableBody.innerHTML = tableHTML;
        
        if (overallAdvice.length === 0) {
            adviceBox.textContent = 'Harika! 50/30/20 kuralına tamamen uyuyorsunuz. Finansal durumunuz sağlıklı.';
            adviceBox.style.borderLeftColor = 'var(--success-color)';
        } else {
            adviceBox.innerHTML = '<strong>⚠️ Dikkat Edilmesi Gerekenler:</strong><br>' + overallAdvice.join('<br>');
            adviceBox.style.borderLeftColor = 'var(--danger-color)';
        }
    },
    renderIncomeExpenseChart: (transactions) => {
        const ctx = document.getElementById('incomeExpenseChart');
        if (!ctx) return;
        
        if (chartInstances.incomeExpenseChart) {
            chartInstances.incomeExpenseChart.destroy();
        }

        const dailyData = {}; 

        transactions.forEach(t => {
            const date = t.date;
            const amount = parseFloat(t.amount);
            if (!dailyData[date]) {
                dailyData[date] = { income: 0, expense: 0 };
            }

            if (t.status === 'paid') {
                if (t.type === 'income') {
                    dailyData[date].income += amount;
                } else if (t.type === 'expense') {
                    dailyData[date].expense += amount;
                }
            }
        });

        const sortedDates = Object.keys(dailyData).sort();
        const incomeData = sortedDates.map(date => dailyData[date].income);
        const expenseData = sortedDates.map(date => dailyData[date].expense);

        chartInstances.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedDates,
                datasets: [
                    {
                        label: 'Gelir (TL)',
                        data: incomeData,
                        backgroundColor: Utils.isDarkMode ? '#66bb6a' : '#43a047',
                        stack: 'Stack 0',
                    },
                    {
                        label: 'Gider (TL)',
                        data: expenseData.map(e => e * -1), 
                        backgroundColor: Utils.isDarkMode ? '#ef5350' : '#e53935',
                        stack: 'Stack 0',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(Math.abs(value)); 
                            }
                        }
                    },
                    x: {
                        stacked: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += Utils.formatCurrency(Math.abs(context.parsed.y));
                                return label;
                            }
                        }
                    }
                }
            }
        });
    },
    renderCategoryDistributionChart: (transactions) => {
        const ctx = document.getElementById('categoryDistributionChart');
        if (!ctx) return;
        
        if (chartInstances.categoryDistributionChart) {
            chartInstances.categoryDistributionChart.destroy();
        }

        const categoryTotals = {};
        
        transactions
            .filter(t => t.type === 'expense' && t.status === 'paid')
            .forEach(t => {
                const category = t.mainCategory;
                const amount = parseFloat(t.amount);
                categoryTotals[category] = (categoryTotals[category] || 0) + amount;
            });
            
        const labels = Object.keys(categoryTotals);
        const data = labels.map(label => categoryTotals[label]);
        
        const colors = ['#0d47a1', '#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd', '#43a047', '#e53935'];

        chartInstances.categoryDistributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const total = context.chart._metasets[0].total;
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(2);
                                label += Utils.formatCurrency(value) + ` (%${percentage})`;
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
 };
// --- MODÜL: MANAGEMENT (Değişmedi) ---
const ManagementModule = { /* ... (Yönetim modülü olduğu gibi korunmuştur) ... */ 
    renderManagementPage: () => {
        ManagementModule.renderCategoryLists();
        ManagementModule.load503020Rates();
    },
    load503020Rates: () => {
        document.getElementById('rateNeeds').value = CORE.rates.needs;
        document.getElementById('rateWants').value = CORE.rates.wants;
        document.getElementById('rateSavings').value = CORE.rates.savings;
        ManagementModule.updateRateWarning();
    },
    save503020Rates: (e) => {
        e.preventDefault();
        const needs = parseInt(document.getElementById('rateNeeds').value);
        const wants = parseInt(document.getElementById('rateWants').value);
        const savings = parseInt(document.getElementById('rateSavings').value);
        const total = needs + wants + savings;

        if (total !== 100) {
            alert(`Hata: Oranların toplamı 100 olmalıdır. Şu anki toplam: ${total}%`);
            return;
        }
        
        CORE.rates = { needs, wants, savings };
        Utils.saveData();
        alert('50/30/20 oranları güncellendi.');
        ManagementModule.updateRateWarning();
    },
    updateRateWarning: () => {
        const needs = parseInt(document.getElementById('rateNeeds').value) || 0;
        const wants = parseInt(document.getElementById('rateWants').value) || 0;
        const savings = parseInt(document.getElementById('rateSavings').value) || 0;
        const total = needs + wants + savings;
        
        const warningEl = document.getElementById('rateWarning');
        warningEl.textContent = `Toplam: ${total}%`;
        warningEl.style.color = total === 100 ? 'var(--success-color)' : 'var(--danger-color)';
    },
    renderCategoryLists: () => {
        const mainListEl = document.getElementById('mainCategoryList');
        const subListEl = document.getElementById('subCategoryList');
        
        if (!mainListEl || !subListEl) return;
        
        mainListEl.innerHTML = '';
        subListEl.innerHTML = '';

        Object.keys(CORE.categories).forEach(mainCat => {
            const catData = CORE.categories[mainCat];
            
            // Ana Kategori Listesi
            const mainDiv = document.createElement('div');
            mainDiv.className = 'category-list-item';
            mainDiv.innerHTML = `
                <span>${mainCat} <small>(${Utils.translateUsageType(catData.type)})</small></span>
                <div>
                    <button onclick="ManagementModule.openCategoryModal('main', 'edit', '${mainCat}')" title="Düzenle"><i class="fas fa-edit"></i></button>
                    <button onclick="ManagementModule.deleteCategory('main', '${mainCat}')" title="Sil"><i class="fas fa-trash"></i></button>
                    <button onclick="ManagementModule.openCategoryModal('sub', 'add', '${mainCat}')" title="Alt Kategori Ekle" class="btn-primary" style="font-size: 0.8em; margin-left: 5px;">+ Alt</button>
                </div>
            `;
            mainListEl.appendChild(mainDiv);

            // Alt Kategori Listesi
            catData.subs.forEach(subCat => {
                const subDiv = document.createElement('div');
                subDiv.className = 'category-list-item';
                subDiv.innerHTML = `
                    <span>${subCat} <small>(<i class="fas fa-chevron-right" style="font-size: 0.7em;"></i> ${mainCat})</small></span>
                    <div>
                        <button onclick="ManagementModule.openCategoryModal('sub', 'edit', '${mainCat}', '${subCat}')" title="Düzenle"><i class="fas fa-edit"></i></button>
                        <button onclick="ManagementModule.deleteCategory('sub', '${mainCat}', '${subCat}')" title="Sil"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                subListEl.appendChild(subDiv);
            });
        });
    },
    openCategoryModal: (type, mode, mainCatName = '', subCatName = '') => {
        const modal = document.getElementById('categoryModal');
        const usageField = document.getElementById('categoryUsageField');
        const parentField = document.getElementById('parentCategoryField');
        const parentSelect = document.getElementById('parentCategorySelect');
        const titleEl = document.getElementById('modalTitle');
        const form = document.getElementById('categoryForm');
        form.reset();

        document.getElementById('categoryType').value = type;
        document.getElementById('originalCategoryName').value = type === 'main' ? mainCatName : subCatName;
        
        parentSelect.innerHTML = '';
        Object.keys(CORE.categories).forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            parentSelect.appendChild(option);
        });

        if (type === 'main') {
            usageField.style.display = 'block';
            parentField.style.display = 'none';
            if (mode === 'add') {
                titleEl.textContent = 'Yeni Ana Kategori Ekle';
            } else {
                titleEl.textContent = 'Ana Kategori Düzenle';
                document.getElementById('categoryName').value = mainCatName;
                document.getElementById('categoryUsageSelect').value = CORE.categories[mainCatName].type;
            }
        } else {
            parentField.style.display = 'block';
            usageField.style.display = 'none';
            parentSelect.value = mainCatName;
            
            if (mode === 'add') {
                titleEl.textContent = `Yeni Alt Kategori Ekle (${mainCatName})`;
            } else {
                titleEl.textContent = 'Alt Kategori Düzenle';
                document.getElementById('categoryName').value = subCatName;
            }
        }

        form.onsubmit = (e) => ManagementModule.saveCategory(e, type, mainCatName, subCatName);
        modal.style.display = 'block';
    },
    saveCategory: (e, type, originalMainCat, originalSubCat) => {
        e.preventDefault();
        const newName = document.getElementById('categoryName').value.trim();
        
        if (!newName) {
            alert('Kategori adı boş olamaz.');
            return;
        }
        
        const currentParentCat = document.getElementById('parentCategorySelect').value;

        if (type === 'main') {
            const newType = document.getElementById('categoryUsageSelect').value;
            
            if (originalMainCat && originalMainCat !== newName) {
                if (CORE.categories[newName]) {
                    alert('Bu ana kategori adı zaten mevcut.');
                    return;
                }
                CORE.categories[newName] = CORE.categories[originalMainCat];
                CORE.categories[newName].type = newType;
                delete CORE.categories[originalMainCat];
            } else if (!originalMainCat) {
                if (CORE.categories[newName]) {
                    alert('Bu ana kategori zaten mevcut.');
                    return;
                }
                CORE.categories[newName] = { type: newType, subs: [] };
            } else if (originalMainCat === newName) {
                CORE.categories[newName].type = newType;
            }

        } else if (type === 'sub') {
            
            if (originalSubCat) {
                const oldSubs = CORE.categories[originalMainCat]?.subs || [];
                const subIndex = oldSubs.indexOf(originalSubCat);
                if (subIndex !== -1) {
                    oldSubs.splice(subIndex, 1);
                }
                
                if (CORE.categories[currentParentCat].subs.includes(newName) && newName !== originalSubCat) {
                    alert('Bu alt kategori, yeni ana kategori altında zaten mevcut.');
                    CORE.categories[originalMainCat].subs.push(originalSubCat);
                    return;
                }
                
                CORE.categories[currentParentCat].subs.push(newName);

            } else {
                if (CORE.categories[currentParentCat].subs.includes(newName)) {
                    alert('Bu alt kategori bu ana kategori altında zaten mevcut.');
                    return;
                }
                CORE.categories[currentParentCat].subs.push(newName);
            }
        }

        document.getElementById('categoryModal').style.display = 'none';
        Utils.saveData();
        ManagementModule.renderCategoryLists();
        App.populateCategorySelects();
    },
    deleteCategory: (type, mainCatName, subCatName, confirmDeletion = true) => {
        if (confirmDeletion && !confirm(`Bu ${type === 'main' ? 'ana kategori' : 'alt kategori'} ve ilgili tüm kayıtları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) return;
        
        // **UYARI:** Bu noktada, silinen kategoriyi kullanan tüm transactions güncellenmeli (örneğin 'Diğer' olarak atanmalı). Basitlik için sadece silme işlemi yapılır.
        
        if (type === 'main') {
            if (CORE.categories[mainCatName]) {
                delete CORE.categories[mainCatName];
            }
        } else if (type === 'sub') {
            if (CORE.categories[mainCatName]) {
                const subIndex = CORE.categories[mainCatName].subs.indexOf(subCatName);
                if (subIndex !== -1) {
                    CORE.categories[mainCatName].subs.splice(subIndex, 1);
                }
            }
        }
        
        Utils.saveData();
        ManagementModule.renderCategoryLists();
        App.populateCategorySelects();
    }
};

// --- START UP ---
document.addEventListener('DOMContentLoaded', App.init);
