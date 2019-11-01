import mongoose from 'mongoose'
import { CountyModel } from './model/county'
import { UserModel } from './model/user'
import md5 from 'md5';
import { ReligionModel, FamilyPositionModel, BirthLocationModel, BirthHelperModel, BirthTypeModel, BloodTypeModel, DisabilityModel, ChronicPainModel, AkseptorKBModel, InsuranceModel, EducationModel, JobModel } from './model/resident';

const doMigration = async (current) => {
    let mig = await mongoose.connection.db.collection('config').findOne({ '_id': 'MIGRATION' })
    if (mig == null) {
        mig = { version: 0 }
        await mongoose.connection.db.collection('config').insertOne({ '_id': 'MIGRATION', 'version': 0 })
    }
    for (let i = mig.version + 1; i <= current; i++) {
        await singleMigration(i)
    }
    await mongoose.connection.db.collection('config').updateOne({ '_id': 'MIGRATION' }, { '$set': { version: current } })
}

const singleMigration = async (version) => {
    if (version === 1) {
        const provinsi = await CountyModel.create({ name: 'Jawa Timur', code: 'Jatim', type: 'provinsi' })
        const kabupaten = await CountyModel.create({ name: 'Bojonegoro', code: 'BJN', type: 'kabupaten', provinsiId: provinsi.id })
        const kecamatan = await CountyModel.create({ name: 'Purwosari', code: 'KECPUR', type: 'kecamatan', provinsiId: provinsi.id, kabupatenId: kabupaten.id })
        const desa = await CountyModel.create({ name: 'Purwosari', code: 'DESAPUR', type: 'desa', provinsiId: provinsi.id, kabupatenId: kabupaten.id, kecamatanId: kecamatan })
        await UserModel.create({ username: 'admin', password: md5('mypass123'), name: 'Administrator', permissions: ['ngadimin'] })
        await UserModel.create({ username: 'mona', password: md5('mypass123'), name: 'Monalisa', desaId: desa.id })
    } else if (version == 2) {
        await Promise.all(
            ['ISLAM', 'KRISTEN', 'KATHOLIK', 'HINDU', 'BUDHA', 'KHONGHUCU', 'KEPERCAYAAN / LAINNYA'].
                map(async (v) => {
                    await ReligionModel.create({ name: v });
                }));
        await Promise.all(
            ['KEPALA KELUARGA', 'SUAMI', 'ISTRI', 'ANAK', 'MENANTU', 'CUCU', 'ORANG TUA', 'MERTUA', 'FAMILI', 'PEMBANTU', 'LAINNYA'].
                map(async (v) => {
                    await FamilyPositionModel.create({ name: v });
                }));
        await Promise.all(
            ['RS/RB', 'PUSKESMAS', 'POLINDES', 'RUMAH', 'LAINNYA'].
                map(async (v) => {
                    await BirthLocationModel.create({ name: v });
                }));
        await Promise.all(
            ['DOKTER', 'BIDAN', 'DUKUN', 'LAINNYA'].
                map(async (v) => {
                    await BirthHelperModel.create({ name: v });
                }));
        await Promise.all(
            ['TIDAK/BELUM SEKOLAH', 'BELUM TAMAT SD/SEDERAJAT', 'TAMAT SD/SEDERAJAT', 'SLTP/SEDERAJAT', 'SLTA/SEDERAJAT', 'DIPLOMA I/SEDERAJAT',
                'DIPLOMA II/SEDERAJAT', 'AKADEMI/DIPLOMA III/S.MUDA', 'DIPLOMA IV/STRATA I/SEDERAJAT', 'STRATA II/SEDERAJAT', 'STRATA III/SEDERAJAT'].
                map(async (v) => {
                    await EducationModel.create({ name: v });
                }));
        await Promise.all(
            ['BELUM/TIDAK BEKERJA', 'MENGURUS RUMAH TANGGA', 'PELAJAR/MAHASISWA', 'PENSIUNAN', 'PEGAWAI NEGERI SIPIL (PNS)',
                'TENTARA NASIONAL INDONESIA (TNI)', 'KEPOLISIAN RI (POLRI)', 'PERDAGANGAN', 'PETANI/PEKEBUN', 'PETERNAK',
                'NELAYAN/PERIKANAN', 'INDUSTRI', 'KONSTRUKSI', 'TRANSPORTASI', 'KARYAWAN SWASTA', 'KARYAWAN BUMN', 'KARYAWAN BUMD',
                'KARYAWAN HONORER', 'BURUH HARIAN LEPAS', 'BURUH TANI/PERKEBUNAN', 'BURUH NELAYAN/PERIKANAN', 'BURUH PETERNAKAN',
                'PEMBANTU RUMAH TANGGA', 'TUKANG CUKUR', 'TUKANG LISTRIK', 'TUKANG BATU', 'TUKANG KAYU', 'TUKANG SOL SEPATU',
                'TUKANG LAS/PANDAI BESI', 'TUKANG JAHIT', 'TUKANG GIGI', 'PENATA RIAS', 'PENATA BUSANA', 'PENATA RAMBUT', 'MEKANIK',
                'SENIMAN', 'TABIB', 'PARAJI', 'PERANCANG BUSANA', 'PENTERJEMAH', 'IMAM MASJID', 'PENDETA', 'PASTOR', 'WARTAWAN',
                'USTADZ/MUBALIGH', 'JURU MASAK', 'PROMOTOR ACARA', 'ANGGOTA DPR-RI', 'ANGGOTA DPD', 'ANGGOTA BPK', 'PRESIDEN',
                'WAKIL PRESIDEN', 'ANGGOTA MAHKAMAH KONSTITUSI', 'ANGGOTA KABINET KEMENTERIAN', 'DUTA BESAR', 'GUBERNUR', 'WAKIL GUBERNUR',
                'BUPATI', 'WAKIL BUPATI', 'WALIKOTA', 'WAKIL WALIKOTA', 'ANGGOTA DPRD PROVINSI', 'ANGGOTA DPRD KABUPATEN/KOTA',
                'DOSEN', 'GURU', 'PILOT', 'PENGACARA', 'NOTARIS', 'ARSITEK', 'AKUNTAN', 'KONSULTAN', 'DOKTER', 'BIDAN', 'PERAWAT', 'APOTEKER',
                'PSIKIATER/PSIKOLOG', 'PENYIAR TELEVISI', 'PENYIAR RADIO', 'PELAUT', 'PENELITI', 'SOPIR', 'PIALANG', 'PARANORMAL',
                'PEDAGANG', 'PERANGKAT DESA', 'KEPALA DESA', 'BIARAWATI', 'WIRASWASTA', 'LAINNYA'].
                map(async (v) => {
                    await JobModel.create({ name: v });
                }));
        await Promise.all(
            ['TUNGGAL', 'KEMBAR 2', 'KEMBAR 3', 'KEMBAR 4', 'KEMBAR 5'].
                map(async (v) => {
                    await BirthTypeModel.create({ name: v });
                }));
        await Promise.all(
            ['A', 'A+', 'A-', 'B', 'B+', 'B-', 'AB', 'AB+', 'AB-', 'O', 'O+', 'O-'].
                map(async (v) => {
                    await BloodTypeModel.create({ name: v });
                }));
        await Promise.all(
            ['CACAT FISIK', 'CACAT NETRA/BUTA', 'CACAT RUNGU/WICARA', 'CACAT MENTAL/JIWA', 'CACAT LAINNYA'].
                map(async (v) => {
                    await DisabilityModel.create({ name: v });
                }));
        await Promise.all(
            ['JANTUNG', 'LEVER', 'PARU-PARU', 'KANKER', 'STROKE', 'DIABETES MILITUS', 'GINJAL', 'MALARIA', 'LEPRA/KUSTA', 'HIV/AIDS', 'GILA/STRESS', 'TBC', 'ASMA'].
                map(async (v) => {
                    await ChronicPainModel.create({ name: v });
                }));
        await Promise.all(
            ['PIL', 'IUD', 'SUNTIK', 'KONDOM', 'SUSUK KB', 'STERILISASI WANIA', 'STERILISASI PRIA', 'LAINNYA'].
                map(async (v) => {
                    await AkseptorKBModel.create({ name: v });
                }));
        await Promise.all(
            ['TIDAK/BELUM PUNYA', 'BPJS PENERIMA IURAN BANTUAN', 'BPJS MANDIRI', 'ASURANSI LAINNYA'].
                map(async (v) => {
                    await InsuranceModel.create({ name: v });
                }));
    }
}

export default doMigration;