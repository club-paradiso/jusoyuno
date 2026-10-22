(()=>{"use strict";
const EN={hero:"Can't write your address in Korean? Scan the document, check the official record, and write it yourself. No guessing, no hand-offs.",privacyBadge:"Photo stays on your device",noLogin:"No account needed",sectionTitle:"Find your Korean address",sectionSubtitle:"Take a photo of the address area, or type an address to search.",step1:"Read your document",step2:"Check & write it",noticeTitle:"Only the address, please.",noticeText:"Cover names, ID numbers, contract amounts, and signatures. Photograph just the address area.",upload:"Take photo / choose image",uploadHint:"JPG, PNG, WebP · 12 MB max · processed on-device",cropHint:"Move the orange selection over the address. Drag its corner to resize.",recognize:"Recognize address",remove:"Remove image",or:"OR TYPE IT",addressLabel:"Korean address or building name",searchHint:"You can edit any text recognized from your photo.",searchBtn:"Search official address",emptyTitle:"Your address appears here.",emptyText:"Search, select the matching official address, and check the building and unit numbers.",official:"OFFICIAL BASE ADDRESS",copyKo:"Copy Korean",copyEn:"Copy English",unitLabel:"Building / apartment / unit (if applicable)",unitNotice:"You enter and verify this yourself. It is not checked by official address search.",copyCombined:"Copy address + unit",startOver:"Start over",warning:"This tool does not verify residence, ownership, or document authenticity. Review and write your own application.",manualTitle:"Official search isn't connected yet.",manualHelp:"An API key is required. You may copy recognized text after checking it; OCR text is never an official result.",copyInput:"Copy my text (unverified)",officialLink:"Official address site ↗",qa1:"Photos stay local",qa1t:"OCR runs on your device. Language files may download from third-party CDNs.",qa2:"Only address queries leave the browser",qa2t:"With official lookup enabled, the address keyword is sent to the official API. Never include private identifiers.",qa3:"You're in control",qa3t:"An address record cannot prove your residence. Always verify your building and unit.",working:"Recognizing the selected area on this device…",success:"Text recognized. Check and correct it before searching.",imageError:"Select a JPG, PNG or WebP under 12 MB.",ocrError:"Could not recognize text. Please type the address manually.",enter:"Enter an address or building name first.",searching:"Checking official address records…",none:"No matches. Try a different address or building name.",select:"Select the matching address below.",unavailable:"Official address search is not configured yet.",network:"Could not connect to official address search.",copied:"Copied.",copyError:"Copy failed. Select and copy the text manually.",sensitive:"Remove personal identifiers such as phone numbers, identity numbers, or emails before searching.",authProblem:"Official address API key is invalid or expired. An administrator must check the search-API key.",queryRejected:"The official service rejected this search term. Try a more precise road name and building number.",timeout:"The address service timed out. Please retry.",providerError:"Official address search is temporarily unavailable. Try again or use the official website.",postal:"Postal code",rateLimited:"Too many searches. Please wait a moment and try again."};
const KO={hero:"한국어 주소를 적기 어렵나요? 서류의 주소를 촬영하고 공식 주소와 대조한 뒤 본인이 직접 작성하세요.",privacyBadge:"사진은 기기에서만 처리",noLogin:"회원가입 불필요",sectionTitle:"한국어 주소 찾기",sectionSubtitle:"서류의 주소 부분만 촬영하거나 직접 검색하세요.",step1:"서류에서 주소 읽기",step2:"확인하고 직접 작성하기",noticeTitle:"주소 부분만 촬영하세요.",noticeText:"이름, 등록번호, 계약금액, 서명은 가리고 주소 부분만 촬영하세요.",upload:"사진 촬영 / 이미지 선택",uploadHint:"JPG, PNG, WebP · 최대 12MB · 기기 내부 처리",cropHint:"주황색 영역을 주소 위로 이동하고 모서리를 끌어 크기를 조절하세요.",recognize:"주소 인식하기",remove:"사진 삭제",or:"또는 직접 입력",addressLabel:"한국어 주소 또는 건물명",searchHint:"인식된 글자는 검색 전에 수정할 수 있어요.",searchBtn:"공식 주소 검색",emptyTitle:"검색한 주소가 여기에 표시됩니다.",emptyText:"검색 후 일치하는 공식 주소를 선택하고 건물번호 및 동·호수를 확인하세요.",official:"공식 기본주소",copyKo:"한글 주소 복사",copyEn:"영문 주소 복사",unitLabel:"동·호수 또는 상세주소 (해당 시)",unitNotice:"상세주소는 본인이 직접 확인하세요. 공식 검색으로 확인한 정보가 아닙니다.",copyCombined:"주소 + 상세주소 복사",startOver:"처음부터",warning:"이 도구는 실제 거주 사실, 소유권 또는 서류 진위를 확인하지 않습니다. 신청서는 본인이 확인하고 직접 작성해야 합니다.",manualTitle:"공식 주소 검색 연결이 필요합니다.",manualHelp:"실시간 검색에는 API 승인키가 필요합니다. OCR 결과는 공식 주소가 아니니 확인한 뒤 복사하세요.",copyInput:"입력 주소 복사 (미검증)",officialLink:"공식 주소 사이트 ↗",qa1:"사진은 기기에만 남습니다",qa1t:"OCR은 브라우저에서 실행됩니다. 인식에 필요한 파일은 외부 CDN에서 다운로드될 수 있습니다.",qa2:"주소 검색어만 전송합니다",qa2t:"공식 검색을 설정하면 주소 검색어만 주소 API로 전달됩니다. 개인정보는 입력하지 마세요.",qa3:"최종 확인은 본인이",qa3t:"기본주소 결과는 거주 사실의 증명이 아닙니다. 동·호수도 직접 확인하세요.",working:"기기에서 주소 영역을 인식하는 중…",success:"인식 완료. 확인·수정한 뒤 검색하세요.",imageError:"12MB 이하 JPG, PNG, WebP 파일을 사용하세요.",ocrError:"인식에 실패했습니다. 주소를 직접 입력하세요.",enter:"주소 또는 건물명을 먼저 입력하세요.",searching:"공식 주소 정보 확인 중…",none:"검색 결과가 없습니다. 주소를 수정해 보세요.",select:"아래에서 일치하는 주소를 선택하세요.",unavailable:"공식 주소 검색 기능이 아직 설정되지 않았습니다.",network:"주소 검색 서비스에 연결할 수 없습니다.",copied:"복사했습니다.",copyError:"복사 실패. 직접 선택해 복사하세요.",sensitive:"전화번호, 주민·외국인등록번호, 이메일 등 개인정보를 삭제하고 주소만 검색하세요.",authProblem:"공식 주소 검색 API의 승인키가 잘못되었거나 만료되었습니다. 관리자에게 알려주세요.",queryRejected:"공식 주소 검색 서비스에서 검색어를 거부했습니다. 도로명과 건물번호를 확인하세요.",timeout:"주소 검색 시간이 초과됐습니다. 다시 시도해 주세요.",providerError:"공식 주소 검색 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.",postal:"우편번호",rateLimited:"검색 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."};
const ZH={hero:"不会填写韩文地址？拍摄地址部分、查询官方记录，然后自行填写。",privacyBadge:"照片仅在设备上处理",noLogin:"无需注册",sectionTitle:"查找韩文地址",sectionSubtitle:"拍摄文件中的地址，或直接输入地址。",step1:"识别文件地址",step2:"核对并自行填写",noticeTitle:"只拍摄地址部分",noticeText:"请遮盖姓名、证件号码、合同金额和签名。",upload:"拍照 / 选择图片",uploadHint:"JPG、PNG、WebP · 最大12MB",cropHint:"将橙色框移到地址上，拖动右下角调整大小。",recognize:"识别地址",remove:"移除图片",or:"或手动输入",addressLabel:"韩文地址或建筑物名称",searchHint:"识别结果可编辑。",searchBtn:"查询官方地址",emptyTitle:"地址将显示在这里",emptyText:"选择相符地址，并核对楼栋和房间号。",official:"官方基础地址",copyKo:"复制韩文地址",copyEn:"复制英文地址",unitLabel:"楼栋及房号（如有）",unitNotice:"需自行确认；该信息未经官方查询验证。",copyCombined:"复制地址及房号",startOver:"重新开始",warning:"本工具不能验证居住事实、所有权或文件真实性。请自行核对并填写申请表。",manualTitle:"官方查询尚未连接",manualHelp:"实时查询需要API密钥。OCR内容不属于已验证的官方结果。",copyInput:"复制输入内容（未经验证）",officialLink:"打开官方地址网站 ↗",qa1:"照片保留在设备上",qa1t:"OCR在浏览器运行，语言文件可能从第三方CDN下载。",qa2:"仅发送地址搜索词",qa2t:"启用查询后仅发送地址搜索词，勿输入个人识别号码。",qa3:"请自行确认",qa3t:"基础地址不能证明居住事实，请自行确认房号。",working:"正在本机识别…",success:"识别完成，请检查。",imageError:"请选择12MB以下的JPG/PNG/WebP。",ocrError:"识别失败，请手动输入。",enter:"请先输入地址。",searching:"正在查询官方地址…",none:"没有匹配结果。",select:"请选择相符的地址。",unavailable:"官方查询尚未配置。",network:"无法连接地址服务。",copied:"已复制。",copyError:"复制失败。",sensitive:"请删除电话号码、身份证号码或电子邮箱，只搜索地址。",postal:"邮政编码",authProblem:"官方地址 API 密钥无效或已过期，请联系管理员检查搜索 API 密钥。",queryRejected:"官方服务拒绝了该搜索词，请使用更准确的道路名和建筑物编号。",timeout:"地址服务超时，请重试。",providerError:"官方地址搜索暂时不可用，请稍后重试。",rateLimited:"搜索次数过多，请稍候再试。"};
const VI={hero:"Khó viết địa chỉ bằng tiếng Hàn? Chụp phần địa chỉ, tra cứu chính thức và tự điền.",privacyBadge:"Ảnh xử lý trên thiết bị",noLogin:"Không cần tài khoản",sectionTitle:"Tìm địa chỉ tiếng Hàn",sectionSubtitle:"Chụp phần địa chỉ hoặc nhập để tìm.",step1:"Đọc địa chỉ trên giấy tờ",step2:"Kiểm tra và tự điền",noticeTitle:"Chỉ chụp phần địa chỉ",noticeText:"Che tên, mã số giấy tờ, số tiền và chữ ký.",upload:"Chụp / chọn ảnh",uploadHint:"JPG, PNG, WebP · tối đa 12MB",cropHint:"Kéo khung cam đến địa chỉ; kéo góc để thay đổi kích thước.",recognize:"Nhận dạng địa chỉ",remove:"Xóa ảnh",or:"HOẶC NHẬP",addressLabel:"Địa chỉ hoặc tên tòa nhà bằng tiếng Hàn",searchHint:"Có thể sửa văn bản nhận dạng.",searchBtn:"Tìm địa chỉ chính thức",emptyTitle:"Địa chỉ sẽ hiển thị ở đây",emptyText:"Chọn địa chỉ phù hợp và kiểm tra số tòa, số phòng.",official:"ĐỊA CHỈ CƠ BẢN CHÍNH THỨC",copyKo:"Sao chép tiếng Hàn",copyEn:"Sao chép tiếng Anh",unitLabel:"Tòa / số phòng (nếu có)",unitNotice:"Bạn cần tự xác minh phần này.",copyCombined:"Sao chép địa chỉ + phòng",startOver:"Bắt đầu lại",warning:"Công cụ không xác minh nơi cư trú, sở hữu hay giấy tờ. Tự kiểm tra và điền đơn.",manualTitle:"Chưa kết nối tìm kiếm chính thức",manualHelp:"Cần khóa API. Kết quả OCR chưa được xác minh.",copyInput:"Sao chép văn bản (chưa xác minh)",officialLink:"Trang địa chỉ chính thức ↗",qa1:"Ảnh ở trên thiết bị",qa1t:"OCR chạy trong trình duyệt; dữ liệu ngôn ngữ có thể tải từ CDN.",qa2:"Chỉ gửi từ khóa địa chỉ",qa2t:"Không nhập số định danh cá nhân.",qa3:"Bạn tự xác nhận",qa3t:"Địa chỉ cơ bản không chứng minh cư trú. Hãy xác nhận số phòng.",working:"Đang nhận dạng trên thiết bị…",success:"Đã nhận dạng. Hãy kiểm tra.",imageError:"Chọn JPG/PNG/WebP dưới 12MB.",ocrError:"Không thể nhận dạng. Hãy nhập thủ công.",enter:"Vui lòng nhập địa chỉ.",searching:"Đang tra cứu…",none:"Không có kết quả.",select:"Chọn địa chỉ phù hợp.",unavailable:"Chưa cấu hình tra cứu chính thức.",network:"Không thể kết nối dịch vụ.",copied:"Đã sao chép.",copyError:"Sao chép thất bại.",sensitive:"Vui lòng xóa số điện thoại, số định danh hoặc email. Chỉ tìm địa chỉ.",postal:"Mã bưu chính",authProblem:"Khóa API địa chỉ chính thức không hợp lệ hoặc đã hết hạn. Quản trị viên cần kiểm tra khóa API tìm kiếm.",queryRejected:"Dịch vụ chính thức đã từ chối từ khóa này. Hãy dùng tên đường và số tòa chính xác hơn.",timeout:"Dịch vụ địa chỉ đã hết thời gian chờ. Vui lòng thử lại.",providerError:"Tìm kiếm địa chỉ chính thức tạm thời không khả dụng. Hãy thử lại sau.",rateLimited:"Quá nhiều lượt tìm kiếm. Vui lòng đợi một lát rồi thử lại."};
const ID={hero:"Sulit menulis alamat Korea? Foto bagian alamat, cocokkan data resmi, lalu isi sendiri.",privacyBadge:"Foto tetap di perangkat",noLogin:"Tanpa akun",sectionTitle:"Cari alamat Korea",sectionSubtitle:"Foto bagian alamat atau ketik untuk mencari.",step1:"Baca alamat dokumen",step2:"Periksa & isi sendiri",noticeTitle:"Foto bagian alamat saja",noticeText:"Tutupi nama, nomor identitas, nilai kontrak, dan tanda tangan.",upload:"Ambil / pilih foto",uploadHint:"JPG, PNG, WebP · maks. 12MB",cropHint:"Geser kotak jingga ke alamat. Seret sudut untuk mengubah ukuran.",recognize:"Kenali alamat",remove:"Hapus foto",or:"ATAU KETIK",addressLabel:"Alamat atau nama gedung (Korea)",searchHint:"Teks hasil pengenalan bisa diedit.",searchBtn:"Cari alamat resmi",emptyTitle:"Alamat muncul di sini",emptyText:"Pilih alamat yang sesuai dan periksa nomor gedung serta kamar.",official:"ALAMAT DASAR RESMI",copyKo:"Salin Korea",copyEn:"Salin Inggris",unitLabel:"Gedung / kamar (jika ada)",unitNotice:"Anda wajib memverifikasi sendiri informasi ini.",copyCombined:"Salin alamat + kamar",startOver:"Mulai ulang",warning:"Alat ini tidak membuktikan tempat tinggal, kepemilikan, atau keaslian dokumen. Periksa formulir sendiri.",manualTitle:"Pencarian resmi belum terhubung",manualHelp:"Diperlukan kunci API. Teks OCR belum diverifikasi.",copyInput:"Salin teks (belum diverifikasi)",officialLink:"Situs alamat resmi ↗",qa1:"Foto tetap lokal",qa1t:"OCR berjalan di browser; berkas bahasa dapat diunduh dari CDN.",qa2:"Hanya kata pencarian dikirim",qa2t:"Jangan masukkan nama atau nomor identitas.",qa3:"Periksa sendiri",qa3t:"Alamat dasar tidak membuktikan tempat tinggal. Periksa nomor unit.",working:"Mengenali pada perangkat…",success:"Teks dikenali. Periksa kembali.",imageError:"Gunakan JPG/PNG/WebP di bawah 12MB.",ocrError:"Pengenalan gagal. Ketik manual.",enter:"Masukkan alamat dulu.",searching:"Mencari alamat resmi…",none:"Tidak ada hasil.",select:"Pilih alamat yang cocok.",unavailable:"Pencarian resmi belum dikonfigurasi.",network:"Layanan alamat tidak tersedia.",copied:"Tersalin.",copyError:"Gagal menyalin.",sensitive:"Hapus nomor telepon, nomor identitas, atau email sebelum mencari alamat.",postal:"Kode pos",authProblem:"Kunci API alamat resmi tidak valid atau kedaluwarsa. Admin perlu memeriksa kunci API pencarian.",queryRejected:"Layanan resmi menolak kata pencarian ini. Gunakan nama jalan dan nomor gedung yang lebih tepat.",timeout:"Layanan alamat kehabisan waktu. Silakan coba lagi.",providerError:"Pencarian alamat resmi sementara tidak tersedia. Coba lagi nanti.",rateLimited:"Terlalu banyak pencarian. Tunggu sebentar lalu coba lagi."};
const HI={hero:"कोरियाई पता लिखना कठिन है? पते की फ़ोटो लें, आधिकारिक रिकॉर्ड जाँचें और खुद फ़ॉर्म भरें।",privacyBadge:"फ़ोटो आपके डिवाइस पर",noLogin:"खाते की ज़रूरत नहीं",sectionTitle:"कोरियाई पता खोजें",sectionSubtitle:"पते की फ़ोटो लें या पता टाइप करें।",step1:"दस्तावेज़ से पता पढ़ें",step2:"जाँचें और स्वयं लिखें",noticeTitle:"सिर्फ पते की फ़ोटो लें",noticeText:"नाम, पहचान नंबर, रकम और हस्ताक्षर ढकें।",upload:"फ़ोटो लें / चुनें",uploadHint:"JPG, PNG, WebP · अधिकतम 12MB",cropHint:"नारंगी चयन पते पर रखें और कोने से आकार बदलें।",recognize:"पता पहचानें",remove:"फ़ोटो हटाएँ",or:"या टाइप करें",addressLabel:"कोरियाई पता या भवन का नाम",searchHint:"पहचाने गए पाठ को सुधार सकते हैं।",searchBtn:"आधिकारिक पता खोजें",emptyTitle:"पता यहाँ दिखेगा",emptyText:"सही पता चुनें और भवन एवं कमरे का नंबर जाँचें।",official:"आधिकारिक मूल पता",copyKo:"कोरियाई कॉपी",copyEn:"अंग्रेज़ी कॉपी",unitLabel:"भवन / कमरा (यदि हो)",unitNotice:"इसे स्वयं सत्यापित करें।",copyCombined:"पता + कमरा कॉपी",startOver:"फिर से शुरू करें",warning:"यह उपकरण निवास, स्वामित्व या दस्तावेज़ की प्रामाणिकता प्रमाणित नहीं करता। आवेदन स्वयं जाँचें।",manualTitle:"आधिकारिक खोज अभी जुड़ी नहीं है",manualHelp:"API कुंजी चाहिए। OCR पाठ सत्यापित नहीं है।",copyInput:"असत्यापित पाठ कॉपी",officialLink:"आधिकारिक पता साइट ↗",qa1:"फ़ोटो स्थानीय रहती है",qa1t:"OCR ब्राउज़र में चलता है; भाषा फ़ाइलें CDN से आ सकती हैं।",qa2:"केवल पता खोज भेजी जाती है",qa2t:"व्यक्तिगत पहचान संख्या न लिखें।",qa3:"अंतिम पुष्टि स्वयं करें",qa3t:"मूल पता निवास का प्रमाण नहीं है। कमरे का नंबर जाँचें।",working:"डिवाइस पर पहचान जारी…",success:"पाठ पहचाना गया। जाँचें।",imageError:"12MB से छोटी JPG/PNG/WebP फ़ाइल चुनें।",ocrError:"पहचान विफल। पता टाइप करें।",enter:"पहले पता लिखें।",searching:"पता खोज रहे हैं…",none:"कोई परिणाम नहीं।",select:"मिलता पता चुनें।",unavailable:"आधिकारिक खोज उपलब्ध नहीं है।",network:"पता सेवा से नहीं जुड़ सका।",copied:"कॉपी हो गया।",copyError:"कॉपी विफल।",sensitive:"खोजने से पहले फ़ोन नंबर, पहचान संख्या और ईमेल हटाएँ।",postal:"पिन कोड",authProblem:"आधिकारिक पता API कुंजी अमान्य या समाप्त है। व्यवस्थापक को खोज API कुंजी जाँचनी होगी।",queryRejected:"आधिकारिक सेवा ने यह खोज शब्द अस्वीकार किया। अधिक सटीक सड़क नाम और भवन नंबर आज़माएँ।",timeout:"पता सेवा का समय समाप्त। कृपया फिर से प्रयास करें।",providerError:"आधिकारिक पता खोज अस्थायी रूप से उपलब्ध नहीं है। बाद में फिर प्रयास करें।",rateLimited:"बहुत अधिक खोजें। कृपया थोड़ी देर प्रतीक्षा करके फिर प्रयास करें।"};
const dict={en:EN,ko:KO,zh:ZH,vi:VI,id:ID,hi:HI};
const OCR_COPY={"en":{"ocrCandidatesTitle":"Possible address readings (NOT VERIFIED)","ocrHint":"Handwriting and faint text can be misread. Choose or edit an option, then check against official address records.","ocrOption":"Use this reading","ocrNoCandidates":"We could not reliably read an address. Try a clearer, closer photo or type it.","ocrLowConfidence":"Low-confidence reading. Carefully correct errors before searching.","ocrProgress":"Reading locally, pass","ocrCloudTitle":"Optional handwriting recognition","ocrCloudExplain":"Only the cropped address image will be sent to Microsoft Azure for recognition. This transfers image data outside your device. Cover names, ID numbers and signatures first. Do not use real sensitive documents without authorization.","ocrCloudConsent":"I agree to send ONLY the cropped address image to the external OCR provider for this request.","ocrCloudRun":"Try handwriting reader","ocrCloudStatus":"Handwriting reader is processing the cropped image…","ocrCloudDone":"Handwriting OCR returned possible text. Check and correct it before official address search.","ocrCloudFailed":"Handwriting recognition was unavailable. Continue with local text or type the address.","ocrNotVerified":"OCR guesses are not official address verification.","ocrNewImage":"Image updated. Run recognition again.","ocrImageDecodeError":"This image cannot be opened on your device. Try JPEG, PNG or WebP."},"ko":{"ocrCandidatesTitle":"주소 인식 후보 (미검증)","ocrHint":"악필·흐린 글씨는 잘못 인식될 수 있습니다. 후보를 선택하거나 수정한 뒤 공식 주소를 검색하세요.","ocrOption":"이 후보 사용","ocrNoCandidates":"주소를 충분히 인식하지 못했습니다. 주소 부분을 더 크게 다시 촬영하거나 직접 입력하세요.","ocrLowConfidence":"정확도가 낮은 후보입니다. 검색 전 오타를 꼭 수정하세요.","ocrProgress":"기기 내부 인식 중 · 단계","ocrCloudTitle":"선택적 손글씨 인식","ocrCloudExplain":"주소로 선택한 사진 영역만 Microsoft Azure로 전송합니다. 이미지는 휴대전화를 벗어나므로 이름·등록번호·서명을 미리 가리세요. 기관 승인 없이 민감한 실제 서류는 사용하지 마세요.","ocrCloudConsent":"이번 요청에 한해 잘라낸 주소 이미지의 외부 OCR 전송에 동의합니다.","ocrCloudRun":"손글씨 전용 인식 시도","ocrCloudStatus":"잘라낸 주소 이미지를 손글씨 엔진이 인식하는 중…","ocrCloudDone":"손글씨 인식 후보를 받았습니다. 공식 주소 검색 전 직접 확인하세요.","ocrCloudFailed":"손글씨 인식을 이용할 수 없습니다. 기존 결과를 수정하거나 직접 입력하세요.","ocrNotVerified":"OCR 후보는 공식 주소 확인 결과가 아닙니다.","ocrNewImage":"사진이 변경됐습니다. 다시 인식하세요.","ocrImageDecodeError":"기기에서 이미지를 열 수 없습니다. JPEG·PNG·WebP로 다시 시도하세요."},"zh":{"ocrCandidatesTitle":"可能的地址识别结果（未经验证）","ocrHint":"潦草手写和模糊文字可能识别错误。请选择并修改，再查询官方地址。","ocrOption":"使用此结果","ocrNoCandidates":"无法可靠识别地址。请拍摄更清晰的近照或手动输入。","ocrLowConfidence":"识别可信度较低，请仔细核对。","ocrProgress":"本地识别，第","ocrCloudTitle":"可选手写识别","ocrCloudExplain":"仅选中的地址区域将发送至 Microsoft Azure。请遮盖姓名、证件号码和签名；未经许可请勿上传敏感文件。","ocrCloudConsent":"我同意仅将裁剪后的地址图片发送至外部识别服务完成本次请求。","ocrCloudRun":"尝试手写识别","ocrCloudStatus":"正在识别裁剪后的图片…","ocrCloudDone":"已获取手写识别候选，请自行核对。","ocrCloudFailed":"手写识别不可用，请手动输入。","ocrNotVerified":"OCR识别不等于官方地址核实。","ocrNewImage":"图片已更换，请重新识别。","ocrImageDecodeError":"无法打开此图片。请使用 JPEG、PNG 或 WebP。"},"vi":{"ocrCandidatesTitle":"Các địa chỉ nhận dạng được (CHƯA XÁC MINH)","ocrHint":"Chữ viết tay và ảnh mờ dễ bị đọc sai. Chọn hoặc sửa trước khi tra cứu chính thức.","ocrOption":"Dùng kết quả này","ocrNoCandidates":"Không đọc được địa chỉ rõ ràng. Hãy chụp gần hơn hoặc nhập thủ công.","ocrLowConfidence":"Độ tin cậy thấp. Kiểm tra kỹ trước khi tìm.","ocrProgress":"Nhận dạng trên máy, lượt","ocrCloudTitle":"Nhận dạng chữ viết tay tùy chọn","ocrCloudExplain":"Chỉ phần ảnh địa chỉ đã cắt được gửi tới Microsoft Azure. Che tên, số định danh và chữ ký. Không gửi tài liệu nhạy cảm khi chưa được phép.","ocrCloudConsent":"Tôi đồng ý gửi CHỈ phần ảnh địa chỉ đã cắt tới dịch vụ OCR bên ngoài cho lần này.","ocrCloudRun":"Thử đọc chữ viết tay","ocrCloudStatus":"Đang nhận dạng chữ viết tay…","ocrCloudDone":"Đã có kết quả OCR. Hãy kiểm tra lại.","ocrCloudFailed":"Không thể nhận dạng chữ viết tay. Hãy nhập thủ công.","ocrNotVerified":"Kết quả OCR không phải xác minh địa chỉ chính thức.","ocrNewImage":"Ảnh đã thay đổi. Vui lòng nhận dạng lại.","ocrImageDecodeError":"Không mở được ảnh. Hãy thử JPEG, PNG hoặc WebP."},"id":{"ocrCandidatesTitle":"Kemungkinan hasil baca alamat (BELUM DIVERIFIKASI)","ocrHint":"Tulisan tangan dan foto buram mudah salah dibaca. Pilih atau perbaiki sebelum mencari alamat resmi.","ocrOption":"Gunakan hasil ini","ocrNoCandidates":"Alamat tidak terbaca dengan yakin. Ambil foto lebih dekat atau ketik sendiri.","ocrLowConfidence":"Keyakinan rendah. Periksa dan perbaiki.","ocrProgress":"Membaca secara lokal, tahap","ocrCloudTitle":"Pengenalan tulisan tangan opsional","ocrCloudExplain":"Hanya gambar alamat yang dipotong dikirim ke Microsoft Azure. Tutupi nama, nomor identitas, dan tanda tangan. Jangan unggah dokumen sensitif tanpa izin.","ocrCloudConsent":"Saya setuju mengirim HANYA gambar alamat yang dipotong ke penyedia OCR eksternal untuk permintaan ini.","ocrCloudRun":"Coba baca tulisan tangan","ocrCloudStatus":"Mengenali tulisan tangan…","ocrCloudDone":"Hasil tulisan tangan diterima. Periksa lagi.","ocrCloudFailed":"Pengenalan tulisan tangan tidak tersedia. Silakan ketik.","ocrNotVerified":"Hasil OCR bukan verifikasi alamat resmi.","ocrNewImage":"Foto berubah. Jalankan OCR lagi.","ocrImageDecodeError":"Gambar tidak dapat dibuka. Gunakan JPEG, PNG, atau WebP."},"hi":{"ocrCandidatesTitle":"संभावित पता पहचान (असत्यापित)","ocrHint":"अस्पष्ट हस्तलिपि गलत पढ़ी जा सकती है। आधिकारिक खोज से पहले चुनें या सुधारें।","ocrOption":"यह पाठ उपयोग करें","ocrNoCandidates":"पता स्पष्ट नहीं पढ़ा जा सका। पास से फ़ोटो लें या लिखें।","ocrLowConfidence":"विश्वास कम है। खोजने से पहले सावधानी से जाँचें।","ocrProgress":"डिवाइस पर पढ़ना, चरण","ocrCloudTitle":"वैकल्पिक हस्तलिपि पहचान","ocrCloudExplain":"केवल काटी गई पते की छवि Microsoft Azure को भेजी जाएगी। नाम, पहचान नंबर, हस्ताक्षर छिपाएँ। बिना अनुमति संवेदनशील दस्तावेज़ न भेजें।","ocrCloudConsent":"मैं इस अनुरोध के लिए केवल काटी गई पते की छवि बाहरी OCR को भेजने की सहमति देता/देती हूँ।","ocrCloudRun":"हस्तलिपि पहचान आज़माएँ","ocrCloudStatus":"हस्तलिपि पढ़ी जा रही है…","ocrCloudDone":"संभावित परिणाम मिला। सत्यापित करें।","ocrCloudFailed":"हस्तलिपि पहचान उपलब्ध नहीं है। खुद लिखें।","ocrNotVerified":"OCR परिणाम आधिकारिक पता सत्यापन नहीं है।","ocrNewImage":"फ़ोटो बदली गई। फिर से पहचानें।","ocrImageDecodeError":"छवि नहीं खुल सकी। JPEG, PNG या WebP आज़माएँ।"}};
for(const language of Object.keys(OCR_COPY))OCR_COPY[language].galleryLabel={en:"Choose from photos instead",ko:"사진 보관함에서 선택",zh:"从相册选择",vi:"Chọn từ thư viện ảnh",id:"Pilih dari galeri",hi:"फ़ोटो गैलरी से चुनें"}[language];
const $=id=>document.getElementById(id);let lang="en",selected=null,photoURL=null,worker=null,drag=null;
const t=k=>(OCR_COPY[lang]&&OCR_COPY[lang][k])||(dict[lang]&&dict[lang][k])||EN[k]||k;
function translate(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(n=>n.textContent=t(n.dataset.i18n));if(scanResults?.length)showOcrCandidates(scanResults);}
$("language").addEventListener("change",e=>{lang=e.target.value;translate();});
function status(id,value,kind=""){const el=$(id);el.hidden=!value;el.textContent=value||"";el.className="status"+(kind?" "+kind:"");}

let scanResults=[],ocrGeneration=0,handwritingEnabled=false;
function resetPhoto(){
 ocrGeneration++;
 if(photoURL){URL.revokeObjectURL(photoURL);photoURL=null;}
 $("previewArea").hidden=true;$("photo").value="";$("galleryPhoto").value="";
 $("previewImage").removeAttribute("src");
 $("ocrCandidates").replaceChildren();$("ocrCandidates").hidden=true;
 $("cloudConsent").checked=false;$("cloudPanel").hidden=true;
 scanResults=[];status("ocrStatus","");
}
async function installPhoto(file){
 if(!file)return;
 resetPhoto();
 const accepted=["image/jpeg","image/png","image/webp","image/heic","image/heif"];
 if(!accepted.includes(file.type)&&!/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name||"")){
  status("ocrStatus",t("imageError"),"error");return;
 }
 if(file.size>12*1024*1024){status("ocrStatus",t("imageError"),"error");return;}
 const gen=ocrGeneration;photoURL=URL.createObjectURL(file);
 const image=$("previewImage");
 image.src=photoURL;
 try{
  await image.decode();
  if(gen!==ocrGeneration)return;
  $("previewArea").hidden=false;
  const selection=$("crop");selection.style.cssText="left:6%;top:22%;width:88%;height:50%";
  $("cloudPanel").hidden=!handwritingEnabled;
  status("ocrStatus",t("ocrNewImage"));
 }catch(_){if(gen===ocrGeneration){resetPhoto();status("ocrStatus",t("ocrImageDecodeError"),"error");}}
}
$("photo").addEventListener("change",e=>{void installPhoto(e.target.files[0]);});
$("galleryPhoto").addEventListener("change",e=>{void installPhoto(e.target.files[0]);});
$("removePhoto").addEventListener("click",resetPhoto);
const crop=$("crop"),frame=$("imageFrame");
crop.addEventListener("pointerdown",e=>{
 const r=frame.getBoundingClientRect(),c=crop.getBoundingClientRect();
 drag={pointer:e.pointerId,x:e.clientX,y:e.clientY,left:(c.left-r.left)/r.width*100,top:(c.top-r.top)/r.height*100,w:c.width/r.width*100,h:c.height/r.height*100,resize:e.clientX>=c.right-42&&e.clientY>=c.bottom-42};
 crop.setPointerCapture(e.pointerId);e.preventDefault();
});
crop.addEventListener("pointermove",e=>{
 if(!drag||e.pointerId!==drag.pointer)return;
 const r=frame.getBoundingClientRect(),dx=(e.clientX-drag.x)/r.width*100,dy=(e.clientY-drag.y)/r.height*100;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 if(drag.resize){crop.style.width=clamp(drag.w+dx,12,100-drag.left)+"%";crop.style.height=clamp(drag.h+dy,10,100-drag.top)+"%";}
 else{crop.style.left=clamp(drag.left+dx,0,100-drag.w)+"%";crop.style.top=clamp(drag.top+dy,0,100-drag.h)+"%";}
});
["pointerup","pointercancel","lostpointercapture"].forEach(ev=>crop.addEventListener(ev,()=>drag=null));
function imageRegion(){
 const img=$("previewImage");
 const l=Math.max(0,Math.min(100,parseFloat(crop.style.left)||6));
 const top=Math.max(0,Math.min(100,parseFloat(crop.style.top)||22));
 const w=Math.max(1,Math.min(100-l,parseFloat(crop.style.width)||88));
 const h=Math.max(1,Math.min(100-top,parseFloat(crop.style.height)||50));
 const pixelW=Math.max(1,Math.round(img.naturalWidth*w/100));
 const pixelH=Math.max(1,Math.round(img.naturalHeight*h/100));
 const ratio=Math.min(1,1900/pixelW,1900/pixelH,Math.sqrt(2300000/(pixelW*pixelH)));
 const c=document.createElement("canvas");
 c.width=Math.max(1,Math.round(pixelW*ratio));
 c.height=Math.max(1,Math.round(pixelH*ratio));
 const x=c.getContext("2d",{willReadFrequently:true});
 if(!x)throw Error("Canvas unsupported");
 x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);
 x.drawImage(img,img.naturalWidth*l/100,img.naturalHeight*top/100,pixelW,pixelH,0,0,c.width,c.height);
 return c;
}
function variation(canvas,mode){
 if(mode==="original")return canvas;
 const image=document.createElement("canvas");image.width=canvas.width;image.height=canvas.height;
 const context=image.getContext("2d",{willReadFrequently:true});
 const input=canvas.getContext("2d",{willReadFrequently:true}).getImageData(0,0,canvas.width,canvas.height);
 const output=window.JusoOCRCore.enhancePixels(input.data,canvas.width,canvas.height,mode);
 input.data.set(output);context.putImageData(input,0,0);return image;
}
function showOcrCandidates(items){
 scanResults=items;
 const container=$("ocrCandidates");container.replaceChildren();container.hidden=!items.length;
 if(!items.length)return;
 const title=document.createElement("strong");title.className="ocr-list-title";title.textContent=t("ocrCandidatesTitle");
 const help=document.createElement("p");help.className="fine";help.textContent=t("ocrHint");
 container.append(title,help);
 items.forEach((item,i)=>{
  const button=document.createElement("button");button.type="button";button.className="candidate ocr-candidate";
  const number=document.createElement("span");number.className="candidate-no";number.textContent=String(i+1).padStart(2,"0");
  const word=document.createElement("b");word.textContent=item.text;
  const label=document.createElement("small");label.textContent=t("ocrOption")+(i===0?" · "+t("ocrLowConfidence"):"");
  button.append(number,word,label);
  button.addEventListener("click",()=>{
   $("keyword").value=item.text;status("ocrStatus",t("ocrNotVerified"),"ok");
   $("keyword").focus();$("keyword").scrollIntoView({behavior:"smooth",block:"center"});
  });
  container.append(button);
 });
}
function candidateFromRecords(records){
 if(!window.JusoOCRCore)throw Error("OCR parser unavailable");
 return window.JusoOCRCore.extractCandidates(records,6);
}
$("runOcr").addEventListener("click",async()=>{
 const btn=$("runOcr"),img=$("previewImage");
 if(!img.naturalWidth||!window.Tesseract?.createWorker||!window.JusoOCRCore){status("ocrStatus",t("ocrError"),"error");return;}
 const gen=ocrGeneration;btn.disabled=true;$("runOcr").setAttribute("aria-busy","true");
 showOcrCandidates([]);
 try{
  const original=imageRegion();
  const passes=["original","contrast","binary"],records=[];
  status("ocrStatus",t("ocrProgress")+" 1/3");
  worker=await window.Tesseract.createWorker("kor+eng",1,{logger:progress=>{
    if(progress.status==="recognizing text"&&gen===ocrGeneration){
     const stage=Math.max(1,records.length+1);
     status("ocrStatus",t("ocrProgress")+" "+stage+"/3 · "+Math.round((progress.progress||0)*100)+"%");
    }
  }});
  if(typeof worker.setParameters==="function")await worker.setParameters({tessedit_pageseg_mode:"6",preserve_interword_spaces:"1"});
  for(let i=0;i<passes.length;i++){
   if(gen!==ocrGeneration)break;
   status("ocrStatus",t("ocrProgress")+" "+(i+1)+"/3");
   const result=await worker.recognize(variation(original,passes[i]));
   records.push({text:result.data.text||"",confidence:result.data.confidence||0,source:passes[i]});
   const current=candidateFromRecords(records);
   // A second pass typically catches faint print. Reserve binary pass for uncertain handwriting.
   if(i===1&&current[0]?.score>=83&&current[0]?.confidence>=76)break;
  }
  if(gen!==ocrGeneration)return;
  const results=candidateFromRecords(records);
  showOcrCandidates(results);
  if(results.length){
   $("keyword").value=results[0].text;status("ocrStatus",t("ocrLowConfidence"));
  }else{
   status("ocrStatus",t("ocrNoCandidates"),"error");
  }
 }catch(_){if(gen===ocrGeneration)status("ocrStatus",t("ocrError"),"error");}
 finally{
  if(worker){try{await worker.terminate();}catch(_){}worker=null;}
  btn.disabled=false;btn.removeAttribute("aria-busy");
 }
});
async function loadHandwritingStatus(){
 try{
  const response=await fetch("/api/handwriting-status",{cache:"no-store",credentials:"omit"});
  const body=await response.json();
  handwritingEnabled=response.ok&&body.enabled===true;
 }catch(_){handwritingEnabled=false;}
 $("cloudPanel").hidden=!(handwritingEnabled&&photoURL);
}
$("cloudConsent").addEventListener("change",e=>{$("cloudRun").disabled=!e.target.checked;});
$("cloudRun").addEventListener("click",async()=>{
 if(!handwritingEnabled||!$("cloudConsent").checked||!$("previewImage").naturalWidth)return;
 const button=$("cloudRun");button.disabled=true;
 const gen=ocrGeneration;status("ocrStatus",t("ocrCloudStatus"));
 try{
  const source=imageRegion();
  const jpeg=source.toDataURL("image/jpeg",0.75);
  if(jpeg.length>2050000){status("ocrStatus",t("imageError"),"error");return;}
  const response=await fetch("/api/handwriting",{
   method:"POST",headers:{"Content-Type":"application/json","X-OCR-Consent":"true"},
   body:JSON.stringify({image:jpeg}),credentials:"omit",cache:"no-store"
  });
  const data=await response.json();
  if(!response.ok)throw Error(data.code||"HANDWRITING_FAILED");
  if(gen!==ocrGeneration)return;
  const fromCloud=(Array.isArray(data.lines)?data.lines:[]).map(x=>({text:x.text||"",confidence:typeof x.confidence==="number"?x.confidence:35,source:"cloud"}));
  const merged=candidateFromRecords([...fromCloud,...scanResults.map(x=>({text:x.text,confidence:x.confidence||25,source:x.source}))]);
  showOcrCandidates(merged);
  if(merged.length){$("keyword").value=merged[0].text;status("ocrStatus",t("ocrCloudDone"),"ok");}
  else status("ocrStatus",t("ocrNoCandidates"),"error");
 }catch(_){if(gen===ocrGeneration)status("ocrStatus",t("ocrCloudFailed"),"error");}
 finally{
  // Consent must be granted anew for any subsequent upload.
  $("cloudConsent").checked=false;button.disabled=true;
 }
});
void loadHandwritingStatus();

function clear(){selected=null;$("selected").hidden=true;$("candidates").hidden=true;$("candidates").replaceChildren();$("manualHelp").hidden=true;$("empty").hidden=false;}
function choose(result){selected=result;$("candidates").hidden=true;$("selected").hidden=false;$("empty").hidden=true;$("krResult").textContent=result.roadAddr;$("enResult").textContent=result.engAddr||"—";$("zipResult").textContent=t("postal")+": "+result.zipNo;const extra=[result.buildingName,result.jibunAddr].filter(Boolean).join(" · ");const ex=$("extraResult");if(ex){ex.textContent=extra;ex.hidden=!extra;}status("searchStatus","");}
$("search").addEventListener("click",async()=>{const keyword=$("keyword").value.trim();clear();if(keyword.length<2){status("searchStatus",t("enter"),"error");return;}const btn=$("search");btn.disabled=true;status("searchStatus",t("searching"));try{const res=await fetch("/api/address",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword}),cache:"no-store",credentials:"omit"});const data=await res.json();if(data.code==="NOT_CONFIGURED"){status("searchStatus",t("unavailable"),"error");$("manualHelp").hidden=false;return;}if(data.code==="SENSITIVE_QUERY"){status("searchStatus",t("sensitive"),"error");return;}if(data.code==="JUSO_AUTH_FAILED"){status("searchStatus",t("authProblem"),"error");return;}if(data.code==="JUSO_QUERY_REJECTED"){status("searchStatus",t("queryRejected"),"error");return;}if(data.code==="RATE_LIMITED"){status("searchStatus",t("rateLimited"),"error");return;}if(data.code==="UPSTREAM_TIMEOUT"){status("searchStatus",t("timeout"),"error");return;}if(!res.ok){status("searchStatus",t("providerError"),"error");return;}const results=Array.isArray(data.results)?data.results:[];if(!results.length){status("searchStatus",t("none"));return;}status("searchStatus",t("select"));$("empty").hidden=true;$("candidates").hidden=false;results.forEach(r=>{const b=document.createElement("button");b.type="button";b.className="candidate";const title=document.createElement("b"),subtitle=document.createElement("small");title.textContent=r.roadAddr;subtitle.textContent=[r.buildingName,r.engAddr,r.jibunAddr,r.zipNo].filter(Boolean).join(" · ");b.append(title,subtitle);b.addEventListener("click",()=>choose(r));$("candidates").append(b);});}catch(_){status("searchStatus",t("network"),"error");$("manualHelp").hidden=false;}finally{btn.disabled=false;}});
$("keyword").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("search").click();}});
async function copy(s){try{await navigator.clipboard.writeText(s);status("searchStatus",t("copied"),"ok");}catch(_){status("searchStatus",t("copyError"),"error");}}
$("copyKr").addEventListener("click",()=>{if(selected)copy(selected.roadAddr);});$("copyEn").addEventListener("click",()=>{if(selected&&selected.engAddr)copy(selected.engAddr);});$("copyComplete").addEventListener("click",()=>{if(selected)copy(selected.roadAddr+($("unit").value.trim()?" "+$("unit").value.trim():""));});$("copyInput").addEventListener("click",()=>{if($("keyword").value.trim())copy($("keyword").value.trim());});$("restart").addEventListener("click",()=>{resetPhoto();clear();$("keyword").value="";$("unit").value="";status("searchStatus","");window.scrollTo({top:0,behavior:"smooth"});});
translate();clear();
})();