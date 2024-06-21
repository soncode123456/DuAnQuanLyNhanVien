// Bước 4: Validation
export function kiemTraNhapThongTin(nvMoi) {
    // Trích xuất dữ liệu đầu vào, khỏi tạo biến chứa các giá trị cố định
    let {tknv, name, email, password, datepicker, luongCB, chucvu, gioLam} = nvMoi;
    let taiKhoanMinLenght = 4;
    let taiKhoanMaxLenght = 6;
    let gioLamMin = 80;
    let gioLamMax = 200;

    // Kiểm tra tính hợp lệ của dữ liệu
    // Kiểm tra tài khoản có độ dài hợp lệ và không trống.
    if(!tknv || tknv.lenght < taiKhoanMinLenght || tknv.lenght > taiKhoanMaxLenght) {
        alert('Tài khoản phải có từ 4 đến 6 ký số, không để trống');
        return false;
    }
    // Kiểm tra Tên nhân viên chỉ chứa chữ cái và khoảng trắng và không trống.
    if (!name || !name.match(/^[\p{L}\s]+$/u)) {
        alert('Tên nhân viên không được để trống và chỉ được chứa chữ cái và khoảng trắng.');
        return false;
    }
    // Kiểm tra Email có định dạng hợp lệ và không trống.
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        alert('Email không được để trống và phải đúng định dạng.');
        return false;
    }
    // Kiểm tra Mật khẩu đáp ứng yêu cầu về độ dài và thành phần.
    let passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,10})/;
    if (!password || !passwordPattern.test(password)) {
        alert('Mật khẩu không được để trống và phải từ 6 đến 10 ký tự (bao gồm ít nhất 1 số, 1 chữ cái viết hoa và 1 ký tự đặc biệt).');
        return false;
    }
    // Kiểm tra Ngày làm có định dạng hợp lệ và không trống.
    let [month, day, year] = datepicker.split('/');
    let ngayLamDate = new Date(`${month}/${day}/${year}`);
    if (!datepicker || isNaN(ngayLamDate.getTime())) {
        alert('Ngày làm không được để trống và phải có định dạng mm/dd/yyyy.');
        return false;
    }
    // Kiểm tra Lương cơ bản nằm trong khoảng quy định và không trống.
    if (!luongCB || luongCB < 1000000 || luongCB > 20000000) {
        alert('Lương cơ bản không được để trống và phải từ 1.000.000 đến 20.000.000.');
        return false;
    }
    // Kiểm tra Chức vụ phải được chọn từ danh sách quy định.
    if (!chucvu || (chucvu !== 'Sếp' && chucvu !== 'Trưởng phòng' && chucvu !== 'Nhân viên')) {
        alert('Vui lòng chọn chức vụ hợp lệ.');
        return false;
    }
    // Kiểm tra Số giờ làm trong tháng nằm trong khoảng quy định và không trống.
    if (!gioLam || gioLam < gioLamMin || gioLam > gioLamMax) {
        alert('Số giờ làm trong tháng không được để trống và phải từ 80 đến 200 giờ.');
        return false;
    }

    return true; // Trả về true nếu dữ liệu nhập vào hợp lệ
}


// Bước 5: Hàm tính tổng lương nhân viên
export function tinhTongLuong(chucvu, luongCB) {
    if (chucvu === 'Sếp') {
        return luongCB * 3;
    } else if (chucvu === 'Trưởng phòng') {
        return luongCB * 2;
    } else if (chucvu === 'Nhân viên') {
        return luongCB;
    } else {
        alert('Vui lòng chọn chức vụ hợp lệ')
        return 0;
    }
}

// Bước 6: Hàm xếp loại nhân viên
export function xepLoai(gioLam) {
    if (gioLam >= 192) {
        return 'Xuất sắc';
    } else if (gioLam >= 176) {
        return 'Giỏi';
    } else if (gioLam >= 160) {
        return 'Khá';
    } else {
        return 'Trung bình';
    }
}

// Hàm tạo nôi dung HTML cho một nhân viên khi tìm kiếm
function taoNoiDungNhanVienTK(nv) {
    return `
        <tr>
            <td>${nv.tknv}</td>
            <td>${nv.name}</td>
            <td>${nv.email}</td>
            <td>${nv.datepicker}</td>
            <td>${nv.chucvu}</td>
            <td>${tinhTongLuong(nv.chucvu, nv.luongCB)}</td>
            <td>${xepLoai(nv.gioLam)}</td>
            <td>
                <button class="btn btn-primary" onclick="chinhSua('${nv.tknv}')">Sửa</button>
                <button class="btn btn-danger" onclick="xoaNhanVien('${nv.tknv}')">Xóa</button>
            </td>
        </tr>
    `;
}
// Hàm hiển thị danh sách nhân viên tìm kiếm
export function hienThiDanhSachTimKiem(danhSach) {
    let output = '';
    for (let nv of danhSach) {
        output += taoNoiDungNhanVienTK(nv);
    }
    return output;
}

export function stringToSlug(title) {
    // Kiểm tra nếu title không được định nghĩa hoặc là null, gán cho nó là chuỗi rỗng
    if (!title || typeof title !== 'string') {
        return ''; // Trả về chuỗi rỗng nếu title không hợp lệ
    }
    
    // Chuyển đổi title thành chuỗi nếu nó không phải là chuỗi
    title = title.toString();
    
    // Đổi chữ hoa thành chữ thường
    let slug = title.toLowerCase();
    
    // Đổi các ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    
    // Xóa các ký tự đặc biệt và khoảng trắng, thay thế bằng dấu gạch ngang
    slug = slug.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Xóa các ký tự gạch ngang liên tiếp
    slug = slug.replace(/\-+/g, '-');
    
    // Xóa ký tự gạch ngang ở đầu và cuối chuỗi
    slug = slug.replace(/^\-+|\-+$/g, '');
    
    return slug;
}
