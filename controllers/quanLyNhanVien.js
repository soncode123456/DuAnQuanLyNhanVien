// Import các hàm và đối tượng cần thiết từ file method.js và NhanVien.js
import { NhanVien } from "../models/NhanVien.js";
import { kiemTraNhapThongTin, tinhTongLuong, xepLoai, hienThiDanhSachTimKiem, stringToSlug } from "../assets/util/method.js";
// Khỏi tạo mảng thông tin nhân viên gốc và mảng thông tin nhân viên tìm kiếm
let arrNhanVien = [];
let arrNhanVienTimKiem = [];

// Bước 2: Thêm nhân viên mới
document.querySelector('#btnThemNV').onclick = function (e) {
    // input: NhanVien: object NhanVien lấy dữ liệu giao diện đưa vào object
    let nv = new NhanVien();
    let arrInput = document.querySelectorAll('.modal-body .form-group .form-control');
    for (let input of arrInput) {
        let id = input.id;
        let value = input.value;
        nv[id] = value;
    }

    // Kiểm tra nếu thông tin nhập không hợp lệ sử dụng hàm kiemTraNhapThongTin
    if(!kiemTraNhapThongTin(nv)) {
        return;
    }

    // Kiểm tra xem mã nhân viên đã tồn tại trong mảng chưa
    let isExist = arrNhanVien.some(nvItem => nvItem.tknv === nv.tknv);
    if (isExist) {
        alert('Mã nhân viên đã tồn tại. Vui lòng chọn mã nhân viên khác.');
        return;
    }

    // Thêm nhân viên vào mảng
    arrNhanVien.push(nv);
    renderTableNhanVien(arrNhanVien);

    resetForm(); // Gọi hàm reset form người dùng nhập

    // Sau khi thêm sinh viên vào mảng thì lưu mảng vào storage
    saveLocalStore();
}

// Bước 1: In ra table danh sách nhân viên
function renderTableNhanVien(arrNV) {
    let htmlString = '';
    arrNV.forEach(nv => {
        htmlString += `
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
            </tr>`;
    });


    // In ra giao diện
    document.querySelector('#tableDanhSach').innerHTML = htmlString;
    return htmlString;
}

// Bước 7: Hàm xóa nhân viên
window.xoaNhanVien = function (tknv) {
    // console.log(tknv);
    let indexDel = arrNhanVien.findIndex(nv => nv.tknv === tknv);

    if (indexDel !== -1) { // Nếu tìm thấy nhân viên có mã = mã của nút click thì xóa nhân viên đó trong mảng
        arrNhanVien.splice(indexDel, 1);
        renderTableNhanVien(arrNhanVien); // Sau khi xóa xong thì render lại table sinh viên từ mảng mới
        saveLocalStore(); // Lưu vào localStorage sau khi xóa
    }
}

// Hàm chỉnh sửa nhân viên
window.chinhSua = function (tknv) {
    document.querySelector('#tknv').disabled = true;

    let nvUpdate = arrNhanVien.find(nv => nv.tknv === tknv);
    if (nvUpdate) {
        // load nhân viên đó lên thẻ form người dùng nhập
        for (let key in nvUpdate) {
            document.querySelector(`#${key}`).value = nvUpdate[key];
        }
        alert('Hãy click vào nút thêm nhân viên để chỉnh sửa thông tin!')
    }
}

// Bước 8: Hàm cập nhật nhân viên (có validation)
document.querySelector('#btnCapNhat').onclick = function (e) {
    // Lấy tất cả thông tin từ giao diện đưa vào object
    let nvEdit = new NhanVien();
    let arrInput = document.querySelectorAll('.modal-body .form-group .form-control');
    for (let input of arrInput) {
        let id = input.id;
        let value = input.value;
        nvEdit[id] = value;
    }

    // Kiểm tra nếu thông tin nhập không hợp lệ sử dụng hàm kiemTraNhapThongTin
    if(!kiemTraNhapThongTin(nvEdit)) {
        return;
    }

    // Sau khi lấy dữ liệu từ giao diện đưa vào object nvEdit => tìm thằng trong mảng dể cập nhập thông tin = nvEdit
    let nvTrongMang = arrNhanVien.find(nv => nv.tknv === nvEdit.tknv)
    if (nvTrongMang) {
        for (let key in nvTrongMang) {
            nvTrongMang[key] = nvEdit[key];
        }
        // Lưu mảng vào localStorage sau khi đã cập nhật
        saveLocalStore();
        // Mảng sau khi thay đổi thì render lại table từ mảng mới
        renderTableNhanVien(arrNhanVien);
        document.querySelector('#tknv').disabled = false;
    }
    resetForm(); // Gọi hàm reset form người dùng nhập
}

// Bước 9: Tìm nhân viên theo loại (xuất săc, giỏi, khá...) và hiển thị
document.querySelector('#btnTimNV').onclick = function (e) {
    // Lấy loại nhân viên từ người dùng nhập vào và chuyển đổi thành slug
    let loaiNVInput = document.querySelector('#searchName').value.trim();
    let loaiNVSlug = stringToSlug(loaiNVInput);

    // Tìm nhân viên theo loại sử dụng slug của loại nhân viên
    arrNhanVienTimKiem = arrNhanVien.filter(nv => {
        let xepLoaiNV = xepLoai(nv.gioLam); // Lấy xếp loại nhân viên từ hàm xepLoai

        // Chuyển đổi xếp loại nhân viên thành slug để so sánh
        let xepLoaiNVSlug = stringToSlug(xepLoaiNV);

        // So sánh slug của xếp loại nhân viên với slug của loại nhân viên nhập vào
        // return xepLoaiNVSlug === loaiNVSlug;
        return xepLoaiNVSlug.includes(loaiNVSlug);
    });

    // Hiển thị kết quả tìm kiếm
    if (arrNhanVienTimKiem.length > 0) {
        let output = hienThiDanhSachTimKiem(arrNhanVienTimKiem);
        document.querySelector('#tableDanhSach').innerHTML = output;
    } else {
        renderTableNhanVien(arrNhanVien); // Hiển thị lại danh sách nhân viên gốc nếu không có kết quả
    }
};

// Hàm reset form người dùng sau khi nhập
function resetForm() {
    let resetInput = document.querySelectorAll('.modal-body .form-group .form-control');
    for(let input of resetInput) {
        input.value = '';
    }
    document.querySelector('#chucvu').value = 'Giám đốc'; // cập nhật lại giá trị mặc định cho chức vụ
}


/*--------------Lưu và tải dữ liệu từ LocalStorage-----------*/
window.saveLocalStore = function () {
    // Biến đổi mảng thành string [] = "[]"
    let strNhanVien = JSON.stringify(arrNhanVien);

    // Lưu vào localStorage
    localStorage.setItem('arrNhanVien', strNhanVien);
}

window.loadLocalStorage = function () {
    if (localStorage.getItem('arrNhanVien')) { //[]
        let strNhanVien = localStorage.getItem('arrNhanVien');
        arrNhanVien = JSON.parse(strNhanVien);
        renderTableNhanVien(arrNhanVien);
    }
}
// Tải dữ liệu từ LocalStorage khi khởi động
loadLocalStorage();