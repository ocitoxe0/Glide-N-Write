# Glide & Write (G&W) - Kapsamlı Dokümantasyon ve Wiki

## 1. Projenin Amacı ve Ortaya Çıkış Hikayesi

**Glide & Write**, farklı sebeplerle konuşamayan (non-verbal) veya konuşma zorluğu çeken bireylerin, çevrelerindeki insanlarla (doktor, öğretmen, polis, aile vb.) hızlı ve etkili bir şekilde iletişim kurmasını sağlamak amacıyla geliştirilmiş yenilikçi bir iletişim (AAC - Augmentative and Alternative Communication) uygulamasıdır. 

**İlham Kaynağı:** Eşim YouTube Shorts'ta Ahren Belisle adındaki bir komedyenin stand-up'ını gülerek izliyordu. Ahren konuşamıyordu ama telefonundan yazıp, yazıyı seslendirerek stand-up yapıyordu. Şahsen ben bundan çok etkilendim ve konuşamayan birisi stand-up yaparken ya da daha basit bir konuşmada örneğin; doktorla, öğretmenle, polisle vb. daha hızlı ve etkili nasıl konuşabilir diye düşünüp, kafa yorup Glide & Write'ı geliştirdim. İlk başta öğrenmesi zor olabilecek bir yöntem, belki yeni bir dil öğrenmek gibi gelebilir ama alışıldığında ve insanlar kendi kombinasyonlarını oluşturdukça efektif bir şekilde kullanabileceğine inanıyorum. Çok değil, dünyada sadece konuşma zorluğu yaşayan 10 kişi; işinde, ailesinde, kafede bunu kullanıp hayatını daha kolay ve rahat sürdürebilirse bu proje amacına ulaşır benim için.

---

## 2. Temel Çalışma Mantığı

Uygulamanın merkezinde geniş bir **"Kaydırma Alanı" (Swipe Area)** bulunur. Kullanıcılar, parmaklarını ekranda belirli yönlere (YUKARI, AŞAĞI, SAĞA, SOLA) kaydırarak kelimeler oluşturur. Her yön veya yön kombinasyonu (örn. YUKARI -> SAĞA), kullanıcının önceden belirlediği bir kelimeye karşılık gelir. 

Kullanıcılar ekrana bakarken, mevcut kombinasyonda hangi yöne kaydırırlarsa hangi kelimenin çıkacağını görsel olarak (okların yanında) görebilirler.

---

## 3. Giriş ve Yazım Modları (Input Modes)

Kullanıcıların el becerilerine ve alışkanlıklarına göre iki farklı yazım yöntemi sunulmaktadır:

### 3.1. Step Mode (Adım Modu)
Bu modda her yön hareketi ve seçim, kesik kesik, adım adım yapılır.
*   **Nasıl çalışır:** Kullanıcı parmağını bir yöne kaydırır, parmağını kaldırır. Ardından kombine devam etmek için başka bir yöne tekrar kaydırır veya kelimeyi seçmek/onaylamak için ekrana bir kez dokunur (tap).
*   **Kullanım Senaryosu:** Sisteme yeni başlayanların mantığı kavraması, hata yapmadan yavaş ve emin adımlarla kombinasyonları öğrenmesi için en ideal moddur.

### 3.2. Glide Mode (Kaydırma Modu)
Bu mod, uygulamanın asıl vadettiği "hızlı iletişim" yeteneğini ortaya çıkarır.
*   **Nasıl çalışır:** Kullanıcı parmağını ekrandan hiç kaldırmadan yönler arasında süzülür (glide). Örneğin, aşağı çeker, sonra hiç kaldırmadan sağa çeker. Ekrandan parmağını kaldırdığı an, o kombinasyonun temsil ettiği kelime anında metin kutusuna yazılır.
*   **Aynı Yönü Tekrarlama:** Eğer kullanıcı aynı yöne iki kez gitmek isterse (örn. SAĞA -> SAĞA), parmağını sağa kaydırıp çok kısa bir süre (ayarlanabilir) duraklar ve tekrar sağa kaydırır.
*   **Kullanım Senaryosu:** Uygulamaya alışmış deneyimli kullanıcıların, parmaklarını hiç kaldırmadan saniyeler içinde bütün bir cümleyi dizebilmesini sağlar.

---

## 4. Çalışma Modları (Operating Modes)

Sağ üst köşedeki düğme (Toggle) ile uygulamanın davranış biçimi iki farklı duruma alınabilir:

### 4.1. Talk On (Konuşma Modu - Normal)
Uygulamanın günlük kullanım modudur. Kaydırma hareketleri kelimeleri metin kutusuna ekler. 

### 4.2. Entry On (Kayıt ve Düzenleme Modu)
Kullanıcının kendi kişisel sözlüğünü oluşturduğu, uygulamayı kendine göre programladığı moddur. 
*   **Nasıl çalışır:** Bu mod aktif edildiğinde ekran arka planı belirgin bir kırmızı renge döner (kullanıcıyı mod değişimi hakkında uyarmak için). Bu modda kaydırma yapıldığında kelime yazılmaz; bunun yerine ekranda bir **"Kelime Ekle/Düzenle"** penceresi açılır.
*   **İşlev:** Kullanıcı az önce yaptığı kaydırma kombinasyonuna (örn. SOL -> YUKARI) hangi kelimenin atanacağını belirler. Bu sayede herkes kendi sık kullandığı kelimeleri, kendi mantığına en uygun hareketlere atayabilir.

---

## 5. Katman Sistemi (Layers)

Sadece 4 ana yön olmasına rağmen on binlerce kelime yazabilmenin sırrı **Katman (Layer)** sistemidir. Maksimum 4 hareketlik bir kombinasyonla (1, 2, 3 ve 4 hareketli kombinasyonların toplamı) bir katmanda **340 adet** eşsiz kelime tanımlanabilir.(4 hareketten daha fazla kombinasyon yapılabilir)

Kullanıcının kelime haznesini katlamak için toplam 4 farklı Katman (Layer) sunulur:
*   Kullanıcı her katmana tamamen farklı kelimeler atayabilir.
*   **Katman Değiştirme:** Ekrandaki fiziksel 1-2-3-4 butonlarına basılarak veya kaydırma alanında **iki parmakla aşağı/yukarı kaydırma** hareketi yapılarak katmanlar arasında saniyesinde geçiş yapılabilir.
*   Bu sistem, bir bireyin binlerce kelimeyi cihaz hafızasında ve kendi kas hafızasında taşımasına olanak tanır.

---

## 6. Hızlı Semboller (Quick Symbols) ve Ek Ekler (Suffix) Özelliği

Kaydırma alanının hemen altında 14 adet hızlı erişim butonu bulunur.

*   **Özellikleri:** Maksimum 5 karakter alabilen bu butonlara noktalama işaretleri, emojiler, sık kullanılan kısa kelimeler (evet, hayır vb.) atanabilir.
*   **Şablonlar (Templates):** Ayarlar bölümünden bu 14 butonluk alan için 4 farklı şablon oluşturulabilir. (Örn: Bir şablon sadece noktalama işaretleri, bir diğeri emojiler, bir diğeri sayılar olabilir).
*   **Tire (-) Ek Özelliği (Prefix Hyphen):** Uygulamanın en zeki özelliklerinden biridir. Eğer "Entry Mode" ile kaydırma kombinasyonlarına veya Hızlı Sembollere başı tire ile başlayan bir metin (örn: `-ing`, `-lar`, `-miş`) eklenirse, uygulama bunu bir **son ek (suffix)** olarak algılar. Bu ek tuşlandığında veya kaydırıldığında, kendinden önce yazılmış olan kelimenin sonuna **boşluk bırakmadan** bitişir (Örn: "gel" yazdıktan sonra "-miş" kombinasyonunu yaparsanız kelime otomatik "gelmiş" olur).

---

## 7. Temel Aksiyon Butonları (Action Buttons)

Arayüzün üst kısmında iletişimi yönetmek için 4 temel buton bulunur:
1.  **Clear (Temizle):** Metin kutusundaki tüm yazıyı anında siler. Yeni bir cümleye başlamak için kullanılır.
2.  **Undo (Geri Al):** Yapılan son kaydırma hareketini veya yazılan son kelimeyi siler. Hatalı kaydırmalarda hayat kurtarır.
3.  **Type (Klavye):** Eğer kullanıcı sisteminde tanımlı olmayan, o an nadir kullanması gereken bir kelimeyi veya özel ismi yazmak isterse, işletim sisteminin standart klavyesini açar.
4.  **Speak (Konuş/Seslendir):** En hayati butondur. Cihazın yerleşik Text-to-Speech (Metinden Sese) motorunu kullanarak metin kutusundaki yazıyı dışarıya (karşıdaki kişiye) yüksek sesle okur.

---

## 8. Konfigürasyonlar (Configurations)

Kullanıcıların sadece tek bir sözlüğü olmak zorunda değildir. Uygulama, tamamen birbirinden bağımsız **Konfigürasyon (Profil)** ortamları sunar.

*   **Farklı Diller ve Ortamlar:** Kullanıcı bir konfigürasyonu "Türkçe - Günlük", diğerini "İngilizce", bir başkasını ise "Okul/İş Terimleri" olarak oluşturabilir.
*   **Ses Motoru Entegrasyonu:** Her konfigürasyonun kendi "Hedef Dili" vardır. Bu sayede "İngilizce" konfigürasyonuna geçildiğinde "Speak" butonuna basıldığında cihaz otomatik olarak İngilizce aksanı ve ses motorunu kullanır.

---

## 9. Ayarlar (Settings)

Uygulamanın kişiselleştirilmesi için zengin bir ayar menüsü mevcuttur:

*   **Appearance (Görünüm - Temalar):** Göz yormayan ve yüksek kontrastlı 6 farklı dikkatlice seçilmiş renk teması (Bone, Oatmeal, Slate, Sage, Charcoal, Midnight).
*   **UI Language (Arayüz Dili):** Uygulamanın menü ve buton dillerinin değiştirilmesi (İngilizce, Türkçe vb.).
*   **Glide Pause Duration (Kaydırma Duraklama Süresi):** Glide Mode (Kaydırma) kullanırken aynı yöne iki kez gitmek için yapılması gereken bekleme süresinin milisaniye (ms) cinsinden hassas ayarı. Herkesin refleks süresi farklı olduğu için kritik bir erişilebilirlik ayarıdır.
*   **Layer Toggle & Settings (Katman Ayarları):** Katman sayısını kısıtlama (eğer kullanıcı 4 katman fazla gelirse 2'ye düşürebilir) ve katman değiştirme butonlarının ekranda sağda mı yoksa solda mı duracağını seçebilme (Solak/Sağlak uyumu).
*   **Quick Symbols Editor:** Yukarıda bahsedilen 4 farklı şablonun içindeki 14 adet düğmenin tek tek içeriğinin değiştirildiği ve düzenlendiği alandır.

---

### Özetle;
**Glide & Write**, salt bir yazılım olmaktan öte, konuşma engeli bulunan bireyler için yeni, hızlı, özelleştirilebilir ve güçlü bir **"dijital lisan"** platformudur. Cihaza bir kez kişisel olarak öğretildiğinde (Entry Mode) ve kas hafızası oturduğunda, günlük hayatta devrim niteliğinde bir iletişim kolaylığı sağlayacak potansiyele sahiptir.
