import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Printer,
  Filter,
  Users,
  Sparkles,
  Layers,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { extracurriculars, schoolInfo } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filteredEkskuls = useMemo(() => {
    return extracurriculars.filter((e) => {
      const matchDay = selectedDay === 'all' || e.day.includes(selectedDay);
      const matchCategory = selectedCategory === 'all' || e.category === selectedCategory;
      return matchDay && matchCategory;
    });
  }, [extracurriculars, selectedDay, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kalender Pembinaan Mingguan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Jadwal Kegiatan Ekstrakurikuler
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Jadwal terintegrasi 12 cabang ekstrakurikuler SMP Alfa Ali Masykur tahun ajaran 2026/2027 mencakup hari latihan, jam, lokasi, dan pembina.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Jadwal Resmi</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Hari
          </button>
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Semua Kategori Bidang</option>
            <option value="Keagamaan">Keagamaan</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Seni & Budaya">Seni & Budaya</option>
            <option value="Kepanduan/Kepemimpinan">Kepanduan/Kepemimpinan</option>
          </select>
        </div>
      </div>

      {/* Grid of Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
        {filteredEkskuls.map((ekskul) => (
          <div
            key={ekskul.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {ekskul.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  {ekskul.day}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1">{ekskul.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{ekskul.description}</p>

              <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Waktu: <strong>{ekskul.time || '14.00–16.00 WIB'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    Tempat: <strong>{ekskul.location}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Pembina: <strong>{ekskul.coachName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    Kapasitas: <strong>{ekskul.enrolled || 20}</strong> / {ekskul.quota} Siswa
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: <strong className="text-emerald-700">Aktif Berjalan</strong></span>
              <span className="font-mono text-slate-400">{ekskul.code}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Official Print Layout */}
      <div className="hidden print:block font-serif text-slate-950 p-4">
        <OfficialLetterhead readOnly />

        <div className="text-center my-4 pb-2 border-b border-slate-800">
          <h2 className="text-base font-black uppercase tracking-wider">
            JADWAL RESMI KEGIATAN EKSTRAKURIKULER MINGGUAN
          </h2>
          <p className="text-xs font-bold uppercase mt-0.5">
            SMP ALFA ALI MASYKUR WONOSOBO
          </p>
          <p className="text-[11px] text-slate-600">
            Tahun Ajaran {schoolInfo.academicYear} • Semester {schoolInfo.semester}
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-800 text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-800 p-2 text-center w-8">No</th>
              <th className="border border-slate-800 p-2 text-left w-36">Cabang Ekskul</th>
              <th className="border border-slate-800 p-2 text-center w-24">Bidang</th>
              <th className="border border-slate-800 p-2 text-center w-20">Hari</th>
              <th className="border border-slate-800 p-2 text-center w-28">Waktu</th>
              <th className="border border-slate-800 p-2 text-left">Lokasi / Tempat</th>
              <th className="border border-slate-800 p-2 text-left w-48">Guru Pembina</th>
              <th className="border border-slate-800 p-2 text-center w-16">Kuota</th>
            </tr>
          </thead>
          <tbody>
            {extracurriculars.map((e, idx) => (
              <tr key={e.id} className="border-b border-slate-800">
                <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                <td className="border border-slate-800 p-2 font-bold">{e.name}</td>
                <td className="border border-slate-800 p-2 text-center">{e.category}</td>
                <td className="border border-slate-800 p-2 text-center font-bold">{e.day}</td>
                <td className="border border-slate-800 p-2 text-center">{e.time || '14.00–16.00'}</td>
                <td className="border border-slate-800 p-2">{e.location}</td>
                <td className="border border-slate-800 p-2">{e.coachName}</td>
                <td className="border border-slate-800 p-2 text-center">{e.quota}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-8 pt-4 flex justify-between items-start text-xs">
          <div className="text-center w-64">
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-20" />
            <p className="font-bold underline">{schoolInfo.principal || 'Afif Mashadi, S.S.'}</p>
            <p>NIP. {schoolInfo.principalNip || '19780512 200501 1 007'}</p>
          </div>

          <div className="text-center w-64">
            <p>Wonosobo, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-bold">Wakasek Kesiswaan</p>
            <div className="h-20" />
            <p className="font-bold underline">{schoolInfo.vicePrincipal || 'Yulianti, S.Pd.'}</p>
            <p>NIP. {schoolInfo.vicePrincipalNip || '19820714 200801 2 011'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
