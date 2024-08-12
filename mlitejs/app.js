function OpenModal(loadURL)
{
    event.preventDefault();

    var modal = $('#myModal');
    var modalContent = $('#myModal .modal-content');

    modal.off('show.bs.modal');
    modal.on('show.bs.modal', function () {
        modalContent.html(loadURL);
    }).modal('show');
    return false;
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}

$(document).ready(function() {

    var api_url = '//mlite.rshd.app/api';
    var app_url = '//basoro.id/mlitejs';
    var nama_instansi = 'mLITE Indonesia';
    var alamat = 'Jl. Perintis Kemerdekaan 45';
    var kota = 'Barabai';
    var propinsi = 'Kalimantan Selatan';
    var telepon = '081250067788';
    var email = 'info@mlite.id';
    var logo = 'data:image/png;base64,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'; 

    // function getUserData(){
    //     return $.ajax({
    //         url: api_url + '/mlite_users/read/usermenu',
    //         headers: {
    //             "X-Api-Key": localStorage.getItem('userkey'),
    //             "X-Access-Token": localStorage.getItem('token')
    //         },
    //         method: 'GET',
    //         dataType: "json"
    //     });
    // }
    
    if(localStorage.getItem('token') && localStorage.getItem('token') !=='undefined') {
        $.ajax({
            url: api_url + '/mlite_users/usermenu',
            headers: {
                "X-Api-Key": localStorage.getItem('userkey'),
                "X-Access-Token": localStorage.getItem('token')
            },
            method: 'GET',
            success: function (data) {
                // console.log(data)
                var sidebar_menu = '';
                sidebar_menu += '<li class="active current-page">';
                sidebar_menu += '    <a href="#dashboard" data-section="dashboard"><i class="ri-group-fill"></i><span class="menu-text">Dashboard</span></a>';
                sidebar_menu += '</li>';
                for ( var i = 0; i < data.msg.length; i++ ) {
                    // console.log(i)
                    if(data.msg[i].module !=='dashboard')
                    sidebar_menu += '<li><a href="#' + data.msg[i].module + '" data-section="' + data.msg[i].module + '"><i class="ri-' + data.msg[i].icon + '"></i><span class="menu-text">' + titleCase(data.msg[i].module.replace(/_/g, ' ')) + '</span></a></li>';
                }
        
                getResponse(sidebar_menu);
            }
        })  
    };

    var dataMenu;
    function getResponse(response) {
        
        dataMenu = response;
        $(".sidebar-menu").html(dataMenu);

        $('.sidebar-menu li').on('click', 'a', function(event) {  
            event.preventDefault();
            $(this)
                .parents()
                .siblings()
                    .removeClass('active current-page')
                .end()
                .addClass('active current-page')
                .end();
            $(".page-wrapper").toggleClass("toggled");
            var section = $(this).data("section");
            loadContent(section);
        }); 

        function loadContent(section) {
            $('select').selectator();
            if(section == 'bangsal') {
                $("#page-section").html("Bangsal");
                var html = '';
                html += '<div class="row gx-3"><div class="col-xxl-12 col-sm-12"><div class="card mb-3">';
                html += '<div class="card-header">';
                html += '    <h5 class="card-title">Kelola Bangsal</h5>';
                html += '</div>';
                html += '<div class="card-body">';
                html += '    <div class="row" style="padding-bottom: 10px;">';
                html += '        <div class="col-md-6 text-left">';
                html += '          <div class="btn-group" role="group" aria-label="Toolbar">';
                html += '              <button id="lihat_data_bangsal" class="btn btn-info" data-bs-toggle="tooltip" data-bs-placement="top" title="Lihat Data">';
                html += '              <i class="ri-eye-line" style="font-size: 15px;"></i><span class="hidden-xs"> Lihat</span> ';
                html += '              </button>';
                html += '              <button id="tambah_data_bangsal" class="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Data">';
                html += '              <i class="ri-add-circle-line" style="font-size: 15px;"></i><span class="hidden-xs"> Tambah</span>';
                html += '              </button>';
                html += '              <button id="edit_data_bangsal" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Data">';
                html += '              <i class="ri-edit-circle-line" style="font-size: 15px;"></i><span class="hidden-xs"> Edit</span>';
                html += '              </button>';
                html += '              <button id="hapus_data_bangsal" class="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Hapus Data">';
                html += '              <i class="ri-delete-bin-line" style="font-size: 15px;"></i><span class="hidden-xs"> Hapus</span>';
                html += '              </button>';
                html += '          </div>';
                html += '        </div>';
                html += '        <div class="col-md-6 text-right">';
                html += '          <div class="input-group" style="width:100%">';
                html += '              <span class="input-group-text">Cari</span>';
                html += '              <span style="width:150px;padding:0 !important;background-color: #cccccc;border: 0px;text-align: left !important;">';
                html += '              <select class="form-select selectator" id="search_field_bangsal" name="search_field_bangsal" style="margin: 0 !important;"> ';
                html += '                  <option value="kd_bangsal">Kd Bangsal</option>';
                html += '                  <option value="nm_bangsal">Nm Bangsal</option>';
                html += '                  <option value="status">Status</option>';
                html += '              </select>';
                html += '              </span>';
                html += '              <input class="form-control" name="search_text_bangsal" id="search_text_bangsal" type="search" placeholder="Masukkan Kata Kunci Pencarian" />';
                html += '              <span class="input-group-text" id="filter_search_bangsal" data-toggle="tooltip" data-placement="top" title="Filter Pencarian"><i class="ri-search-line"></i></span>';
                html += '          </div>';
                html += '        </div>';
                html += '    </div>';
                html += '<div class="table-responsive">';
                html += '<table id="tbl_bangsal" class="table table-striped" width="100%"><thead><tr><th>Kode Bangsal</th><th>Nama Bangsal</th><th>Status</th></tr></thead>';
                html += '<tbody></tbody>';
                html += '</table>';
                html += '</div>';
                html += '</div></div></div></div>';
                $("#app-content").html(html);
        
                var var_tbl_bangsal = $('#tbl_bangsal').DataTable({
                    ajax: {
                        url: api_url + '/bangsal/data/',
                        headers: {
                            "X-Api-Key": localStorage.getItem('userkey'),
                            "X-Access-Token": localStorage.getItem('token')
                        },
                        dataType: "json",
                        crossDomain: true,
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type':'application/json',
                        type: 'POST', 
                        data: function (data) {
                            var search_field_bangsal = $('#search_field_bangsal').val();
                            var search_text_bangsal = $('#search_text_bangsal').val();
                            data.search_field_bangsal = search_field_bangsal;
                            data.search_text_bangsal = search_text_bangsal;
                        },
                        error: function(err) {
                            location.reload();
                        }, 
                    },
                    fnDrawCallback: function () {
                        $('.selectator').selectator();
                    },                  
                    columns: [
                        { 'data': 'kd_bangsal' },
                        { 'data': 'nm_bangsal' },
                        { 'data': 'status' }
                    ],
                    processing: true,
                    serverSide: true,
                    select: true, 
                    pageLength: 10,
                    lengthChange: false,
                    searching: false,
                    order: [[1, 'DESC']]        
                });      
                $('#filter_search_bangsal').click(function () {
                    var_tbl_bangsal.draw();
                });
                $("#edit_data_bangsal").click(function () {
                    var rowData = var_tbl_bangsal.rows({ selected: true }).data()[0];
                    if (rowData != null) {
                        console.log(rowData);
                        var kd_bangsal = rowData['kd_bangsal'];
                        var nm_bangsal = rowData['nm_bangsal'];
                        var status = rowData['status'];
                        
                        //$("#kd_bangsal").prop('disabled', true); // GA BISA DIEDIT KALI DISABLE
                        $('#modal-title').text("Edit Data Bangsal");
                        var html = '<div class="modal-header">';
                        html += '    <h4 class="modal-title">Form Data Bangsal</h4>';
                        html += '    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                        html += '</div>';
                        html += '<div class="modal-body">';
                        html += '<input type="hidden" name="typeact" class="form-control" id="typeact" value="edit" />'; 
                        html += '<div class="row gx-3">';
                        html += '  <div class="col-xxl-3 col-lg-4 col-sm-6">';
                        html += '    <div class="mb-3">';
                        html += '      <label class="form-label" for="kd_bangsal">Kd Bangsal</label>';
                        html += '      <input type="text" class="form-control" id="kd_bangsal" name="kd_bangsal" value="' + kd_bangsal + '" />';
                        html += '    <div class="invalid-feedback error"></div>';
                        html += '    </div>';
                        html += '  </div>';
                        html += '  <div class="col-xxl-3 col-lg-4 col-sm-6">';
                        html += '    <div class="mb-3">';
                        html += '      <label class="form-label" for="nm_bangsal">Nm Bangsal</label>';
                        html += '      <input type="text" class="form-control" id="nm_bangsal" name="nm_bangsal" value="' + nm_bangsal + '" />';
                        html += '    <div class="invalid-feedback error"></div>';
                        html += '    </div>';
                        html += '  </div>';
                        html += '  <div class="col-xxl-3 col-lg-4 col-sm-6">';
                        html += '    <div class="mb-3">';
                        html += '      <label class="form-label" for="status">Status</label>';
                        html += '      <input type="text" class="form-control" id="status" name="status" value="' + status + '" />';
                        html += '    <div class="invalid-feedback error"></div>';
                        html += '    </div>';
                        html += '  </div>';
                        html += '</div>';
                        html += '    <div id="forTable_bangsal"></div>';
                        html += '</div>';
                        html += '<div class="modal-footer">';
                        html += '    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="ri-close-line"></i> Tutup</button>';
                        html += '    <button type="button" id="simpan_data_bangsal" class="btn btn-danger"><i class="ri-file-pdf-2-line"></i> Simpan</button>';
                        html += '</div>';
                        OpenModal(html);
                    }
                    else {
                        bootbox.alert("Silakan pilih data yang akan di edit.");
                    }
            
                });            
                $('#lihat_data_bangsal').click(function() {
        
                    var html = '<div class="modal-header">';
                    html += '    <h4 class="modal-title">Detail Bangsal</h4>';
                    html += '    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                    html += '</div>';
                    html += '<div class="modal-body">';
                    html += '    <div id="forTable_bangsal"></div>';
                    html += '</div>';
                    html += '<div class="modal-footer">';
                    html += '    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="ri-close-line"></i> Tutup</button>';
                    html += '    <button type="button" id="export_pdf_lihat_data_bangsal" class="btn btn-danger"><i class="ri-file-pdf-2-line"></i> PDF</button>';
                    html += '</div>';
        
                    var search_field_bangsal = $('#search_field_bangsal').val();
                    var search_text_bangsal = $('#search_text_bangsal').val();
            
                    $.ajax({
                        url: api_url + "/bangsal/aksi/",
                        headers: {
                            "X-Api-Key": localStorage.getItem('userkey'),
                            "X-Access-Token": localStorage.getItem('token')
                        },
                        method: "POST",
                        data: {
                            typeact: 'lihat', 
                            search_field_bangsal: search_field_bangsal, 
                            search_text_bangsal: search_text_bangsal
                        },
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            var eTable = "<div class='table-responsive'><table id='tbl_lihat_bangsal' class='table display dataTable' style='width:100%'><thead><th>Kd Bangsal</th><th>Nm Bangsal</th><th>Status</th></thead>";
                            for (var i = 0; i < res.length; i++) {
                                eTable += "<tr>";
                                eTable += '<td>' + res[i]['kd_bangsal'] + '</td>';
                                eTable += '<td>' + res[i]['nm_bangsal'] + '</td>';
                                eTable += '<td>' + res[i]['status'] + '</td>';
                                eTable += "</tr>";
                            }
                            eTable += "</tbody></table></div>";
                            $('#forTable_bangsal').html(eTable);
                        }
                    });
                    OpenModal(html);
                });
                $('#tambah_data_bangsal').click(function() {
                    var html = '<div class="modal-header">';
                    html += '    <h4 class="modal-title">Form Data Bangsal</h4>';
                    html += '    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                    html += '</div>';
                    html += '<div class="modal-body">';
                    html += '<input type="hidden" name="typeact" class="form-control" id="typeact" value="add" />'; 
                    html += '<div class="row gx-3">';
                    html += '  <div class="col-xxl-3 col-lg-4 col-sm-6">';
                    html += '    <div class="mb-3">';
                    html += '      <label class="form-label" for="kd_bangsal">Kd Bangsal</label>';
                    html += '      <input type="text" class="form-control" id="kd_bangsal" name="kd_bangsal" />';
                    html += '    <div class="invalid-feedback error"></div>';
                    html += '    </div>';
                    html += '  </div>';
                    html += '  <div class="col-xxl-3 col-lg-4 col-sm-6">';
                    html += '    <div class="mb-3">';
                    html += '      <label class="form-label" for="nm_bangsal">Nm Bangsal</label>';
                    html += '      <input type="text" class="form-control" id="nm_bangsal" name="nm_bangsal" />';
                    html += '    <div class="invalid-feedback error"></div>';
                    html += '    </div>';
                    html += '  </div>';
                    html += '  <div class="col-xxl-3 col-lg-4 col-sm-6">';
                    html += '    <div class="mb-3">';
                    html += '      <label class="form-label" for="status">Status</label>';
                    html += '      <input type="text" class="form-control" id="status" name="status" />';
                    html += '    <div class="invalid-feedback error"></div>';
                    html += '    </div>';
                    html += '  </div>';
                    html += '</div>';
                    html += '    <div id="forTable_bangsal"></div>';
                    html += '</div>';
                    html += '<div class="modal-footer">';
                    html += '    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="ri-close-line"></i> Tutup</button>';
                    html += '    <button type="button" id="simpan_data_bangsal" class="btn btn-danger"><i class="ri-file-pdf-2-line"></i> Simpan</button>';
                    html += '</div>';
                    OpenModal(html);
                });
                $('#hapus_data_bangsal').click(function() {
                    var rowData = var_tbl_bangsal.rows({ selected: true }).data()[0];
                    if (rowData) {
                        var kd_bangsal = rowData['kd_bangsal'];
                        bootbox.confirm('Anda yakin akan menghapus data dengan kd_bangsal="' + kd_bangsal, function(result) {
                            if(result) {
                                $.ajax({
                                    url: api_url + "/bangsal/aksi/",
                                    headers: {
                                        "X-Api-Key": localStorage.getItem('userkey'),
                                        "X-Access-Token": localStorage.getItem('token')
                                    },
                                    method: "POST",
                                    data: {
                                        kd_bangsal: kd_bangsal,
                                        typeact: 'del'
                                    },
                                    success: function (data) {
                                        var audio = new Audio(app_url + '/assets/sound/' + data.status + '.mp3');
                                        audio.play();
                                        if(data.status === 'success') {
                                            bootbox.alert('<span class="text-success">' + data.msg + '</span>');
                                        } else {
                                            bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                                        }    
                                        var_tbl_bangsal.draw();
                                    }
                                })    
                            }
                        });
            
                    }
                    else {
                        var audio = new Audio(app_url + '/assets/sound/danger.mp3');
                        audio.play();
                        bootbox.alert("Pilih satu baris untuk dihapus");
                    }
                    $('#myModal').modal('hide');
                });
            } else if(section == 'pasien') {
                $("#page-section").html("Pasien");
                var html = '';
                html += '<div class="row gx-3"><div class="col-xxl-12 col-sm-12"><div class="card mb-3">';
                html += '<div class="card-header">';
                html += '    <h5 class="card-title">Kelola Pasien</h5>';
                html += '</div>';
                html += '<div class="card-body">';
                html += '    <div class="row" style="padding-bottom: 10px;">';
                html += '        <div class="col-md-6 text-left">';
                html += '          <div class="btn-group" role="group" aria-label="Toolbar">';
                html += '              <button id="lihat_data_pasien" class="btn btn-info" data-bs-toggle="tooltip" data-bs-placement="top" title="Lihat Data">';
                html += '              <i class="ri-eye-line" style="font-size: 15px;"></i><span class="hidden-xs"> Lihat</span> ';
                html += '              </button>';
                html += '              <button id="tambah_data_pasien" class="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Data">';
                html += '              <i class="ri-add-circle-line" style="font-size: 15px;"></i><span class="hidden-xs"> Tambah</span>';
                html += '              </button>';
                html += '              <button id="edit_data_pasien" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Data">';
                html += '              <i class="ri-edit-circle-line" style="font-size: 15px;"></i><span class="hidden-xs"> Edit</span>';
                html += '              </button>';
                html += '              <button id="hapus_data_pasien" class="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Hapus Data">';
                html += '              <i class="ri-delete-bin-line" style="font-size: 15px;"></i><span class="hidden-xs"> Hapus</span>';
                html += '              </button>';
                html += '          </div>';
                html += '        </div>';
                html += '        <div class="col-md-6 text-right">';
                html += '          <div class="input-group" style="width:100%">';
                html += '              <span class="input-group-text">Cari</span>';
                html += '              <span style="width:150px;padding:0 !important;background-color: #cccccc;border: 0px;text-align: left !important;">';
                html += '              <select class="form-select selectator" id="search_field_pasien" name="search_field_pasien" style="margin: 0 !important;"> ';
                html += '                  <option value="no_rkm_medis">Kd pasien</option>';
                html += '                  <option value="nm_pasien">Nm pasien</option>';
                html += '                  <option value="alamat">Alamat</option>';
                html += '              </select>';
                html += '              </span>';
                html += '              <input class="form-control" name="search_text_pasien" id="search_text_pasien" type="search" placeholder="Masukkan Kata Kunci Pencarian" />';
                html += '              <input type="hidden" class="form-control" id="tanggal_awal" placeholder="Tanggal Awal">';
                html += '              <input type="hidden" class="form-control" id="tanggal_akhir" placeholder="Tanggal Akhir">';                   
                html += '              <input type="text" class="form-control daterange" placeholder="Range Tanggal">';
                html += '              <span class="input-group-text" id="filter_search_pasien" data-toggle="tooltip" data-placement="top" title="Filter Pencarian"><i class="ri-search-line"></i></span>';
                html += '          </div>';
                html += '        </div>';
                html += '    </div>';
                html += '<div class="table-responsive">';
                html += '<table id="tbl_pasien" class="table table-striped" width="100%"><thead><tr><th>Nomor RM</th><th>Nama Pasien</th><th>Tanggal</th></tr></thead>';
                html += '<tbody></tbody>';
                html += '</table>';
                html += '</div>';
                html += '</div></div></div></div>';
                $("#app-content").html(html);
        
                var var_tbl_pasien = $('#tbl_pasien').DataTable({
                    ajax: {
                        url: api_url + '/pasien/data/',
                        headers: {
                            "X-Api-Key": localStorage.getItem('userkey'),
                            "X-Access-Token": localStorage.getItem('token')
                        },
                        dataType: "json",
                        crossDomain: true,
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type':'application/json',
                        type: 'POST', 
                        data: function (data) {
                            var search_field_pasien = $('#search_field_pasien').val();
                            var search_text_pasien = $('#search_text_pasien').val();
                            data.search_field_pasien = search_field_pasien;
                            data.search_text_pasien = search_text_pasien;
                            var from_date = $('#tanggal_awal').val();
                            var to_date = $('#tanggal_akhir').val();                            
                            data.searchByFromdate = from_date;
                            data.searchByTodate = to_date;
            
                        },
                        error: function(err) {
                            console.log(err)
                            // location.reload();
                        }, 
                    },
                    columns: [
                        { 'data': 'no_rkm_medis' },
                        { 'data': 'nm_pasien' },
                        { 'data': 'tgl_daftar' }
                    ],
                    processing: true,
                    serverSide: true,
                    select: true, 
                    pageLength: 10,
                    lengthChange: false,
                    searching: false,
                    order: [[1, 'DESC']] 
                });
            } else if(section == 'mlite_users') {
                $("#page-section").html("mLITE Users");
                $("#app-content").html("<b>mLITE Users</b>");
            } else {
                $("#page-section").html("Dashboard");
                $("#app-content").html("<b>Dashboard</b>");
            }
        
            $("#myModal").on('shown.bs.modal', function () {
                $('#simpan_data_bangsal').click(function() {
                    var kd_bangsal = $('#kd_bangsal').val();
                    var nm_bangsal = $('#nm_bangsal').val();
                    var status = $('#status').val();
                    var typeact = $('#typeact').val();
                    $.ajax({
                        url: api_url + "/bangsal/aksi/",
                        headers: {
                            "X-Api-Key": localStorage.getItem('userkey'),
                            "X-Access-Token": localStorage.getItem('token')
                        },
                        method: "POST",
                        data: {
                            typeact: typeact,
                            kd_bangsal: kd_bangsal, 
                            nm_bangsal: nm_bangsal,
                            status: status
                        },
                        success: function (data) {
                            var audio = new Audio(app_url + '/assets/sound/' + data.status + '.mp3');
                            audio.play();
                            if(data.status === 'success') {
                                bootbox.alert('<span class="text-success">' + data.msg + '</span>');
                            } else {
                                bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                            }    
                            var_tbl_bangsal.draw();
                        }
                    })
        
                    $('#myModal').modal('hide');
                });        
                $("#export_pdf_detail_bangsal").click(function () {
                    var doc = new jsPDF('p', 'pt', 'A4'); /* pilih 'l' atau 'p' */
                    doc.addImage(logo, 'JPEG', 20, 10, 50, 50);
                    doc.setFontSize(20);
                    doc.text(nama_instansi, 80, 35, null, null, null);
                    doc.setFontSize(10);
                    doc.text(alamat + ' - ' + kota + ' - ' + propinsi, 80, 46, null, null, null);
                    doc.text('Telepon: ' + telepon + ' - Email: ' + email, 80, 56, null, null, null);
                    doc.line(20,70,572,70,null); /* doc.line(20,70,820,70,null); --> Jika landscape */
                    doc.line(20,72,572,72,null); /* doc.line(20,72,820,72,null); --> Jika landscape */
                    doc.setFontSize(14);
                    doc.text("Data Detail", 20, 95, null, null, null);
                    const totalPagesExp = "{total_pages_count_string}";        
                    doc.autoTable({
                        html: '#tbl_detail_bangsal',
                        startY: 105,
                        margin: {
                            left: 20, 
                            right: 20
                        }, 
                        styles: {
                            fontSize: 10,
                            cellPadding: 5
                        }, 
                        didDrawPage: data => {
                            let footerStr = "Page " + doc.internal.getNumberOfPages();
                            if (typeof doc.putTotalPages === 'function') {
                            footerStr = footerStr + " of " + totalPagesExp;
                            }
                            doc.setFontSize(10);
                            doc.text(`© ${new Date().getFullYear()} {$settings.nama_instansi}.`, data.settings.margin.left, doc.internal.pageSize.height - 10);                
                            doc.text(footerStr, data.settings.margin.left + 480, doc.internal.pageSize.height - 10);
                    }
                    });
                    if (typeof doc.putTotalPages === 'function') {
                        doc.putTotalPages(totalPagesExp);
                    }
                    // doc.save('table_data_propinsi.pdf')
                    window.open(doc.output('bloburl'), '_blank',"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes");          
                });
                $("#export_pdf_lihat_data_bangsal").click(function () {
                    var doc = new jsPDF('p', 'pt', 'A4'); /* pilih 'l' atau 'p' */
                    doc.addImage(logo, 'JPEG', 20, 10, 50, 50);
                    doc.setFontSize(20);
                    doc.setFontSize(20);
                    doc.text(nama_instansi, 80, 35, null, null, null);
                    doc.setFontSize(10);
                    doc.text(alamat + ' - ' + kota + ' - ' + propinsi, 80, 46, null, null, null);
                    doc.text('Telepon: ' + telepon + ' - Email: ' + email, 80, 56, null, null, null);
                    doc.line(20,70,572,70,null); /* doc.line(20,70,820,70,null); --> Jika landscape */
                    doc.line(20,72,572,72,null); /* doc.line(20,72,820,72,null); --> Jika landscape */
                    doc.setFontSize(14);
                    doc.text("Tabel Data Bangsal", 20, 95, null, null, null);
                    const totalPagesExp = "{total_pages_count_string}";        
                    doc.autoTable({
                        html: '#tbl_lihat_bangsal',
                        startY: 105,
                        margin: {
                            left: 20, 
                            right: 20
                        }, 
                        styles: {
                            fontSize: 10,
                            cellPadding: 5
                        }, 
                        didDrawPage: data => {
                            let footerStr = "Page " + doc.internal.getNumberOfPages();
                            if (typeof doc.putTotalPages === 'function') {
                            footerStr = footerStr + " of " + totalPagesExp;
                            }
                            doc.setFontSize(10);
                            doc.text(`© ${new Date().getFullYear()} {$settings.nama_instansi}.`, data.settings.margin.left, doc.internal.pageSize.height - 10);                
                            doc.text(footerStr, data.settings.margin.left + 480, doc.internal.pageSize.height - 10);
                       }
                    });
                    if (typeof doc.putTotalPages === 'function') {
                        doc.putTotalPages(totalPagesExp);
                    }
                    // doc.save('table_data_bangsal.pdf')
                    window.open(doc.output('bloburl'), '_blank',"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes");  
                          
                });
            });

            $('#myModal').on('hidden.bs.modal', '.modal', function () {
                $(this).removeData('bs.modal');
                var_tbl_bangsal.rows('.important').deselect();
            });        

        }
        
    }

    if(!localStorage.getItem('token') || localStorage.getItem('token') =='undefined') {
        $('.page-wrapper').addClass('d-none');
        $('body').addClass('login-bg');
            var html = '';
            html += '<div class="container">';
            html += '    <div class="auth-wrapper">';
            html += '        <div class="auth-box">';
            html += '            <a href="' + app_url + '" class="auth-logo mb-4">';
            html += '                <img src="' + app_url + '/favicon.png" alt="Bootstrap Gallery"> <span class="auth-logo-text">mLITE Indonesia</span>';
            html += '            </a>';
            html += '            <h4 class="mb-4">Login</h4>';
            html += '            <div class="mb-3">';
            html += '                <label class="form-label" for="username">Nama Pengguna <span class="text-danger">*</span></label>';
            html += '                <input type="text" id="username" class="form-control" placeholder="Nama Pengguna">';
            html += '            </div>';
            html += '            <div class="mb-2">';
            html += '                <label class="form-label" for="pwd">Kata Sandi <span class="text-danger">*</span></label>';
            html += '                <div class="input-group">';
            html += '                <input type="password" id="password" class="form-control" placeholder="Kata Sandi">';
            html += '                <button class="btn btn-outline-secondary" type="button" id="openclose">';
            html += '                    <i class="ri-eye-line text-primary"></i>';
            html += '                </button>';
            html += '                </div>';
            html += '            </div>';
            html += '            <div class="d-flex justify-content-end mb-3">';
            html += '                <a href="' + app_url +'" class="text-decoration-underline">Lupa kata sandi?</a>';
            html += '            </div>';
            html += '            <div class="mb-3 d-grid gap-2">';
            html += '                <button type="button" id="login" class="btn btn-primary">Login</button>';
            html += '            </div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
        $("body").html(html);
    }
    $("#openclose").on("click", function () {
        var paswd= $('#password');
        if(paswd.attr("type")== "password"){
            paswd.attr("type","text");
            $('#openclose').attr("value","hide");
            $("i").removeClass("ri-eye-line").addClass("ri-eye-off-line");
        }else{
            paswd.attr("type","password");
            $('#openclose').attr("value","show");
            $("i").removeClass("ri-eye-off-line").addClass("ri-eye-line");
        }
    });
    $('#login').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        if(username == '' || password == '') {
            alert('Username or password cannot empty.');
            exit();
        }
        $.ajax({
            type: "POST",
            url: api_url + "/",
            data: {
                mlite_username: $('#username').val(),
                mlite_password: $('#password').val()
            },
            success: function(data) {
                console.log(data);
                localStorage.userkey = data.msg.key;
                localStorage.token = data.msg.token;
                if(data.msg.token !='') {
                    // alert('Successfully loged in!' + data.msg.token);
                    alert('Successfully loged in!');
                    location.reload();
                } else {
                    alert("Login Failed");
                }
            },
            error: function() {
                alert("Login Failed");
            }
        });
    });
    $('#logout').click(function() {
      localStorage.clear();
      alert("You have been logged out!!");
      location.reload();
    });
    // $('.sidebar-menu li').on('click', 'a', function(event) {  
    //     event.preventDefault();
    //     $(this)
    //         .parents()
    //         .siblings()
    //             .removeClass('active current-page')
    //         .end()
    //         .addClass('active current-page')
    //         .end();
    //     $(".page-wrapper").toggleClass("toggled");
    //     var section = $(this).data("section");
    //     loadContent(section);
    // }); 

});
