'use client'

import axios from 'axios';
import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function Home() {

  const [carModel, setCarModel] = useState<string>("");
  const [carImage, setCarImage] = useState<string>("");
  const [defImage, setDefImage] = useState<string[]>([]);
  const [totPrice, setTotalPrice] = useState<number>(0);
  // const [feat, setFeat] = useState<[]>([]);
  // const [featPrice, setFeatPrice] = useState<number[]>([]);


  const getCar = async () => {
    try {
      if (!carModel) {
        setCarImage("");
        setDefImage([]);
        setCarImage("");
        setTotalPrice(0)
      }
      const res = await axios.get(`/api/cars/get?name=${carModel}`);
      const name = res.data.car[0].name;
      const bgPhoto = res.data.car[0].photo;
      setCarImage(`/${name}/${bgPhoto}`);
      const defImages = res.data.getFeat.map((feat: { photo: string }) => `/${name}/${feat.photo}`).reverse();
      setDefImage(defImages);
      const costs = res.data.car[0].price;
      let costFeat = 0;
      res.data.getFeat.forEach((feature: { price: number }) => {
        console.log(feature.price)
        costFeat += feature.price;
      });
      const totalPrice = costs + costFeat;
      setTotalPrice(totalPrice);
      const featPrice = res.data.getFeat.forEach((feature: { price: number }) => {
        console.log(feature.price)
      });
      console.log(featPrice)
      // setFeatPrice(featPrice)
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const [featCat, setFeatCat] = useState<string>("");
  const [featPhoto, setFeatPhoto] = useState<string[]>([])
  const getFeatCat = async () => {
    try {
      const res = await axios.get(`/api/featuresCategory/get?car=${carModel}&cat=${featCat}`);
      const name = res.data.cat[0].name;
      setFeatCat(name);
      const catPhoto = res.data.getCat.map((feat: { photo: string }) => `/${carModel}/${feat.photo}`);
      setFeatPhoto(catPhoto);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const [isPhotoChanging, setIsPhotoChanging] = useState(false);
  const handleClick = (index: number) => {
    if (!isPhotoChanging) {
      setIsPhotoChanging(true);
      const selectedPhoto = featPhoto[index].replace(`/${carModel}/`, "");
      getOnChangePhoto(selectedPhoto)
        .finally(() => {
          setIsPhotoChanging(false);
        });
    }
  };

  // const getOnChangePhoto = async (selectedPhoto: string) => {
  //   try {
  //     const res = await axios.get(`/api/features/get?photo=${selectedPhoto}`);
  //     const photo = res.data.check[0].photo;
  //     const updatedArray = feat.map((item: any) => {
  //       if (item.photo && item.price) {
  //         const photoOnly = item.photo.replace(`/${carModel}/`, "");
  //         if (
  //           (photoOnly.startsWith('carrozzeria_') && photo.includes('carrozzeria_')) ||
  //           (photoOnly.startsWith('pinze_') && photo.includes('pinze_')) ||
  //           (photoOnly.startsWith('cerchi_') && photo.includes('cerchi_')) ||
  //           (photoOnly.startsWith('capote_') && photo.includes('capote_'))
  //         ) {
  //           console.log(item.price, photo)
  //           return {
  //             ...item,
  //             newPhoto: `/${carModel}/${photo}`,
  //             newPrice: item.price
  //           };
  //         }
  //       }
  //       return item;
  //     });
  //     setFeat(updatedArray);
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };
  const getOnChangePhoto = async (selectedPhoto: string) => {
    try {
      const res = await axios.get(`/api/features/get?photo=${selectedPhoto}`);
      const photo = res.data.check[0].photo;
      const updatedArray = defImage.map((oldPhoto) => {
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
      setDefImage(updatedArray);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCar();
  }, [carModel]);

  useEffect(() => {
    if (carModel && featCat && defImage.length > 0) {
      getFeatCat();
      getOnChangePhoto(defImage[defImage.length - 1].replace(`/${carModel}/`, ""))
    }
  }, [carModel, featCat]);




  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-4xl font-bold my-4 flex justify-center">Car Configurator</h1>
      <div className="flex">
        <div className="w-1/3 my-4">

          {/* car model */}
          <div className='flex justify-center'>
            <label htmlFor="carModel" className="text-lg font-semibold w-1/2">
              Modello Automobile:
            </label>
            <select
              id="carModel"
              className="border border-gray-300 rounded px-3 py-1 ml-2 text-black"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
            >
              <option className="text-center" value="">
                -----
              </option>
              <option value="Grancabrio">Grancabrio</option>
              <option value="Quattroporte">Quattroporte</option>
            </select>
          </div>

          <br />
          {/* feature category */}
          <div className={`flex justify-center ${!carModel && 'hidden'}`}>
            <label htmlFor="carModel" className="text-lg font-semibold w-1/2">
              Categoria Optional:
            </label>
            <select
              id="featCat"
              className="border border-gray-300 rounded px-3 py-1 ml-2 text-black"
              value={featCat}
              onChange={(e) => setFeatCat(e.target.value)}
            >
              <option className="text-center" value="" >
                -----
              </option>
              <option value="Colore Carrozzeria">Colore Carrozzeria</option>
              <option value="Colore Capote">Colore Capote</option>
              <option value="Tipo Cerchi">Tipo Cerchi</option>
              <option value="Tipo Pinze"> Tipo Pinze</option>
            </select>
          </div>

          {/* feat photos */}
          <div className={`flex justify-center m-5 ${(!carModel || !featCat) && 'hidden'}`}>
            <div className="grid grid-cols-3 gap-4">
              {featPhoto.map((photo, index) => (
                <div key={index} onClick={() => handleClick(index)} className="flex flex-col items-center border-2 
                      bg-gray-800 border-gray-400 rounded-lg p-2 hover:cursor-pointer">
                  <Image
                    src={photo}
                    alt="featPhoto"
                    height={150}
                    width={150}
                    className="bg-white rounded-lg"
                  />
                  <p className='text-center my-auto p-1 hover:pointer'>{photo.replace(/_/g, " ").replace(".png", "").split(" ").slice(1).toString().replace(/,/g, " ").toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tot Price */}
          <div className="my-4 flex justify-center">
            <h2 className="text-lg font-bold">
              Tot: {totPrice} €
            </h2>
          </div>
        </div>

        {/* Image Config */}
        <div className="w-2/3 relative">
          {carImage && (
            <div className="mt-14 flex justify-center relative">
              <picture className="flex justify-center relative">
                <Image
                  src={carImage}
                  alt="Car Image"
                  width={800}
                  height={700}
                  className="rounded-lg"
                />
                {/* {feat.map((item, index) => (
                  <div key={index}>
                    <Image
                      src={item}
                      alt={`Image ${index}`}
                      width={800}
                      height={700}
                      className="rounded-lg absolute top-0 left-0"
                    />
                  </div>
                ))} */}

                {/* !! Trovare defImage sotto !! */}
                {defImage.map((path, index) => (
                  <Image
                    key={index}
                    src={path}
                    alt={`Image ${index}`}
                    width={800}
                    height={700}
                    className="rounded-lg absolute top-0 left-0"
                  />
                ))}
              </picture>
            </div>
          )}
        </div>


      </div >
    </div >
  );
}
