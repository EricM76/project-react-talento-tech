import './BannerHome.css'
import banner from '../../assets/img-home-banner.png'

export const BannerHome = () => {
  return (
    <div
      className="banner"
      style={{ 
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
};
