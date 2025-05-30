import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import galleryStyle from "./gallery.module.css";
import { useAuth } from "../../../../context/AuthContext";
import { businessInfoService } from "../../../../services/besinessInfo.service";
import { config } from "../../../../config";

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [templateIndex, setTemplateIndex] = useState(0);
  const { user, accessToken } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    if (!userId || !accessToken) return;
    businessInfoService
      .getBusinessInfo(userId, accessToken)
      .then((data) => {
        const urls = data.data.businessImages.map((path: string) => `${config.apiUrl}/${path}`);
        setImages(urls);
      })
      .catch(console.error);
  }, [userId, accessToken]);

  const templates = [

    images.length && (
      <div className={galleryStyle.mainSideTemplate} key="side">
        <div className={galleryStyle.largeImage}>
          <img src={images[0]} className={galleryStyle.image} />
        </div>
        <div className={galleryStyle.sideImages}>
          {images.slice(1, 5).map((url) => (
            <div className={galleryStyle.smallImageBox} key={url}>
              <img src={url} className={galleryStyle.image} />
            </div>
          ))}
        </div>
      </div>
    ),


    images.length && (
      <div className={galleryStyle.featuredWithThumbs} key="featured">
        <div className={galleryStyle.largeTopImage}>
          <img src={images[0]} className={galleryStyle.image} />
        </div>
        <div className={galleryStyle.thumbnailRow}>
          {images.slice(1, 4).map((url) => (
            <div className={galleryStyle.thumbnailBox} key={url}>
              <img src={url} className={galleryStyle.image} />
            </div>
          ))}
        </div>
      </div>
    ),

    images.length && (
      <div className={galleryStyle.collageTemplate} key="collage">
        {images.slice(0, 10).map((url, i) => (
          <div
            className={galleryStyle.collageItem}
            key={url}
            style={{ "--r": i % 2 ? 3 : -3 } as React.CSSProperties}
          >
            <img src={url} className={galleryStyle.image} />
          </div>
        ))}
      </div>
    ),
  ].filter(Boolean);

  if (!userId || !accessToken || !templates.length) return null;

  return (
    <section className={galleryStyle.galleryWrapper}>
      <div className={galleryStyle.arrowButtons}>
        <button onClick={() => setTemplateIndex((templateIndex - 1 + templates.length) % templates.length)}>
          <FaArrowRight />
        </button>
        <button onClick={() => setTemplateIndex((templateIndex + 1) % templates.length)}>
          <FaArrowLeft />
        </button>
      </div>
      {templates[templateIndex]}
    </section>
  );
}
