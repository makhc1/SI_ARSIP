# KATA PENGANTAR {-}

Puji dan syukur ke hadirat Tuhan Yang Maha Esa atas segala rahmat dan petunjuk-Nya, sehingga **Buku Panduan Penggunaan Sistem Informasi Arsip (SIARSIP KUATHAN)** dapat diselesaikan dengan baik.

Buku panduan ini disusun sebagai pedoman operasional resmi bagi seluruh personel, pejabat pengelola arsip, serta staf operasional di lingkungan Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan), Kementerian Pertahanan Republik Indonesia. Penerapan sistem SIARSIP KUATHAN ini ditujukan untuk memodernisasi tata kelola naskah dinas kedinasan dari sistem distribusi berbasis portal statis menjadi repositori digital terpadu yang terstruktur berdasarkan Tahun Anggaran (T.A.) dan klasifikasi naskah dinas dengan integrasi penyimpanan awan (*cloud storage*) yang aman.

Melalui buku panduan ini, diharapkan para pengguna dapat memahami alur kerja aplikasi secara menyeluruh, mulai dari penelusuran dokumen, pemanfaatan fitur pratinjau instan (*in-app preview*), mekanisme pengusulan unggah berkas arsip, hingga prosedur verifikasi dan persetujuan naskah dinas oleh administrator kearsipan.

Penyusun menyampaikan apresiasi dan ucapan terima kasih kepada pimpinan Ditjen Kuathan Kemhan serta seluruh pihak yang telah memberikan dukungan, masukan teknis, dan dedikasi dalam perancangan maupun implementasi sistem ini. Semoga buku panduan ini memberikan manfaat nyata dalam mewujudkan tata kelola kearsipan kedinasan yang akuntabel, efektif, dan profesional.

```{=typst}
#v(0.8cm)
#align(right)[
  Jakarta, Oktober 2026

  #v(1cm)
  Tim Pengembang SIARSIP KUATHAN
]
#pagebreak()
#outline(
  title: [#align(center)[#text(size: 14pt, weight: "bold")[DAFTAR ISI]]],
  depth: 3,
)
#context {
  if opt-daftar-gambar {
    let imgs = query(figure.where(kind: image))
    if imgs.len() > 0 {
      pagebreak()
      outline(
        title: align(center)[#text(size: 14pt, weight: "bold")[DAFTAR GAMBAR]],
        target: figure.where(kind: image),
      )
    }
  }
  if opt-daftar-tabel {
    let tbls = query(figure.where(kind: table))
    if tbls.len() > 0 {
      pagebreak()
      outline(
        title: align(center)[#text(size: 14pt, weight: "bold")[DAFTAR TABEL]],
        target: figure.where(kind: table),
      )
    }
  }
}
#pagebreak()
#set page(numbering: "1")
#counter(page).update(1)
```

```{=openxml}
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="454"/></w:pPr><w:r><w:t>Jakarta, Oktober 2026</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="567"/></w:pPr><w:r><w:t>Tim Pengembang SIARSIP KUATHAN</w:t></w:r></w:p>
```