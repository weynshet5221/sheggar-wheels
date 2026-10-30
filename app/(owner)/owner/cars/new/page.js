'use client';

import { useEffect, useState } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { getCarById, saveCar } from '@/lib/cars';
import { NEIGHBOURHOODS } from '@/lib/constants';

async function compressPhoto(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Choose an image file such as JPG, PNG, or WEBP.');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 10 MB.');
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 900;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('This browser could not process the selected image.');
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.72;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  while (dataUrl.length > 450000 && quality > 0.4) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  if (dataUrl.length > 450000) {
    const smallerCanvas = document.createElement('canvas');
    const resize = Math.min(1, 650 / Math.max(canvas.width, canvas.height));
    smallerCanvas.width = Math.max(1, Math.round(canvas.width * resize));
    smallerCanvas.height = Math.max(1, Math.round(canvas.height * resize));
    const smallerContext = smallerCanvas.getContext('2d');
    if (!smallerContext) throw new Error('This browser could not process the selected image.');
    smallerContext.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
    dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.45);
  }

  if (dataUrl.length > 450000) {
    throw new Error('This photo is too large to save in the demo browser storage. Please choose a smaller photo.');
  }

  return dataUrl;
}

export default function NewCarListingPage() {
  const [user, setUser] = useState(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [transmission, setTransmission] = useState('Automatic');
  const [seats, setSeats] = useState('5');
  const [neighbourhood, setNeighbourhood] = useState('Bole');
  const [pricePerDay, setPricePerDay] = useState('3500');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const activeUser = getCurrentSession();
    if (!activeUser || !activeUser.roles?.includes('owner')) {
      window.location.href = '/signin';
      return;
    }
    setUser(activeUser);
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile]);

  if (!user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!photoFile) {
      setError('Please upload a photo of your car.');
      return;
    }

    setIsSaving(true);
    try {
      const photoData = await compressPhoto(photoFile);
      const savedCar = saveCar({
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        transmission,
        seats: Number(seats),
        city: 'Addis Ababa',
        neighbourhood,
        latitude: 8.9806,
        longitude: 38.7578,
        pricePerDay: Number(pricePerDay),
        photos: [photoData],
        description: description.trim(),
        unavailableDates: [],
      }, user.id);

      const persistedCar = getCarById(savedCar.id);
      if (!persistedCar?.photos?.[0]) {
        throw new Error('The listing could not be saved. Browser storage may be full; remove unused demo data and try again.');
      }

      window.location.href = '/owner/cars';
    } catch (err) {
      setError(err?.message || 'Could not save the car listing. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-5 sm:p-8 bg-white rounded-2xl border shadow-sm">
      <h1 className="text-2xl font-bold mb-2">Create New Car Listing</h1>

      {error && <div role="alert" className="p-3 mb-4 text-sm bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="car-photo" className="block text-sm font-semibold text-gray-700 mb-2">CAR PHOTO *</label>
          <input
            id="car-photo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            required
            onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1a2e22] file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-[#2d4a3e]"
          />
          {photoPreview && (
            <div className="mt-3 overflow-hidden rounded-xl border bg-gray-50">
              <img src={photoPreview} alt="Preview of selected car" className="w-full h-56 object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="block text-xs font-semibold text-gray-600 mb-1">MAKE</label>
            <input id="make" required value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Toyota" className="w-full border rounded-xl p-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="model" className="block text-xs font-semibold text-gray-600 mb-1">MODEL</label>
            <input id="model" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. RAV4" className="w-full border rounded-xl p-2.5 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="year" className="block text-xs font-semibold text-gray-600 mb-1">YEAR</label>
            <input id="year" required type="number" min="1980" max={new Date().getFullYear() + 1} value={year} onChange={(e) => setYear(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="transmission" className="block text-xs font-semibold text-gray-600 mb-1">TRANSMISSION</label>
            <select id="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm">
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label htmlFor="seats" className="block text-xs font-semibold text-gray-600 mb-1">SEATS</label>
            <input id="seats" required type="number" min="1" max="50" value={seats} onChange={(e) => setSeats(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="neighbourhood" className="block text-xs font-semibold text-gray-600 mb-1">NEIGHBOURHOOD</label>
            <select id="neighbourhood" value={neighbourhood} onChange={(e) => setNeighbourhood(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm">
              {NEIGHBOURHOODS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-gray-600 mb-1">PRICE PER DAY (ETB)</label>
            <input id="price" required type="number" min="1" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-gray-600 mb-1">DESCRIPTION</label>
          <textarea id="description" required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm" placeholder="Describe the vehicle's condition and features..." />
        </div>

        <button disabled={isSaving} type="submit" className="w-full bg-[#1a2e22] text-white py-3 rounded-xl font-bold hover:bg-[#2d4a3e] disabled:opacity-60 disabled:cursor-not-allowed">
          {isSaving ? 'Saving Listing...' : 'Submit for Moderation'}
        </button>
      </form>
    </div>
  );
}
