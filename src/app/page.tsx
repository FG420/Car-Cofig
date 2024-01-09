'use client'

import axios from 'axios';
import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function Home() {
  const [carModel, setCarModel] = useState<string>("");
  const [carImage, setCarImage] = useState<string>("");
  const [defImage, setDefImage] = useState<string[]>([]);
  const [totPrice, setTotalPrice] = useState<number>(0);
  const [featPrices, setFeatPrices] = useState<number[]>([]);
  const [carPrice, setCarPrice] = useState<number>(0);

  const getCarData = async () => {
    const res = await axios.get(`/api/cars/get?name=${carModel}`);

    const name = res.data.car[0].name;
    const bgPhoto = res.data.car[0].photo;
    const defImages = res.data.getFeat.map((feat: { photo: string }) => `/${name}/${feat.photo}`).reverse();
    const carPrice = res.data.car[0].price;
    const featPrices = res.data.getFeat.map((feature: { price: number }) => feature.price);
    const totalFeatPrice = featPrices.reduce((acc: number, price: number) => acc + price, 0);

    setCarImage(`/${name}/${bgPhoto}`);
    setDefImage(defImages);
    setCarPrice(carPrice);
    setFeatPrices(featPrices);
    setTotalPrice(carPrice + totalFeatPrice);
  };

  const handleFeatCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const featCat = e.target.value;
    if (featCat) {
      getFeatCatData(featCat);
    }
  };

  const getFeatCatData = async (featCat: string) => {
    const res = await axios.get(`/api/featuresCategory/get?car=${carModel}&cat=${featCat}`);
    const name = res.data.cat[0].name;
    const catPhoto = res.data.getCat.map((feat: { photo: string }) => `/${carModel}/${feat.photo}`);
    setFeatCat(name);
    setFeatPhoto(catPhoto);
  };

  const [featCat, setFeatCat] = useState<string>("");
  const [featPhoto, setFeatPhoto] = useState<string[]>([]);

  const handleClick = async (index: number) => {
    const selectedPhoto = featPhoto[index].replace(`/${carModel}/`, "");
    const res = await axios.get(`/api/features/get?photo=${selectedPhoto}`);
    const photo = res.data.check[0].photo;
    const updatedPhotoArray = defImage.map((oldPhoto) => {
      const featOnly = oldPhoto.replace(`/${carModel}/`, "");
      if (
        (featOnly.startsWith('carrozzeria_') && photo.includes('carrozzeria_')) ||
        (featOnly.startsWith('pinze_') && photo.includes('pinze_')) ||
        (featOnly.startsWith('cerchi_') && photo.includes('cerchi_')) ||
        (featOnly.startsWith('capote_') && photo.includes('capote_'))
      ) {
        return `/${carModel}/${photo}`;
      }
      return oldPhoto;
    });

    const updatedPriceArray = featPrices.map((oldPrice, i) => i === index ? res.data.check[0].price : oldPrice);
    const totalFeatPrice = updatedPriceArray.reduce((acc: number, price: number) => acc + price, 0);
    const totalPrice = carPrice + totalFeatPrice;

    setDefImage(updatedPhotoArray);
    setFeatPrices(updatedPriceArray);
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    if (carModel) {
      getCarData();
    }
  }, [carModel]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold my-4 flex justify-center">Car Configurator</h1>
      <div className="flex">
        <div className="w-1/3 my-4">
          <div className='flex justify-center'>
            <label htmlFor="carModel" className="text-lg font-semibold w-1/2">Modello Automobile:</label>
            <select id="carModel" className="border border-gray-300 rounded px-3 py-1 ml-2 text-black"
              value={carModel} onChange={(e) => setCarModel(e.target.value)}>
              <option className="text-center" value="">-----</option>
              <option value="Grancabrio">Grancabrio</option>
              <option value="Quattroporte">Quattroporte</option>
            </select>
          </div>
          <br />
          <div className={`flex justify-center ${!carModel && 'hidden'}`}>
            <label htmlFor="featCat" className="text-lg font-semibold w-1/2">Categoria Optional:</label>
            <select id="featCat" className="border border-gray-300 rounded px-3 py-1 ml-2 text-black"
              value={featCat} onChange={handleFeatCatChange}>
              <option className="text-center" value="">-----</option>
              <option value="Colore Carrozzeria">Colore Carrozzeria</option>
              <option value="Colore Capote">Colore Capote</option>
              <option value="Tipo Cerchi">Tipo Cerchi</option>
              <option value="Tipo Pinze">Tipo Pinze</option>
            </select>
          </div>
          <div className={`flex justify-center m-5 ${(!carModel || !featCat) && 'hidden'}`}>
            <div className="grid grid-cols-3 gap-4">
              {featPhoto.map((photo, index) => (
                <div key={index} onClick={() => handleClick(index)}
                  className="flex flex-col items-center border-2 bg-gray-800 border-gray-400 rounded-lg p-2 hover:cursor-pointer">
                  <Image src={photo} alt="featPhoto" height={150} width={150} className="bg-white rounded-lg" />
                  <p className='text-center my-auto p-1 hover:pointer'>
                    {photo.replace(/_/g, " ").replace(".png", "").split(" ").slice(1).join(" ").toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="my-4 flex justify-center">
            <h2 className="text-lg font-bold">Tot: {totPrice} €</h2>
          </div>
        </div>
        <div className="w-2/3 relative">
          {carImage && (
            <div className="mt-14 flex justify-center relative">
              <picture className="flex justify-center relative">
                <Image src={carImage} alt="Car Image" width={800} height={700} className="rounded-lg" />
                {defImage.map((path, index) => (
                  <Image key={index} src={path} alt={`Image ${index}`}
                    width={800} height={700} className="rounded-lg absolute top-0 left-0" />
                ))}
              </picture>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}