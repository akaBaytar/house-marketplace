import { Link } from 'react-router-dom';

import rentCategoryIMG from '../assets/image/rentCategoryImage.jpg';
import sellCategoryIMG from '../assets/image/sellCategoryImage.jpg';

const Explore = () => {
  return (
    <div className='explore'>
      <header>
        <h1 className='pageHeader'>Explore</h1>
      </header>
      <main>
        {/* SLIDER HERE */}

        <h3 className='exploreCategoryHeading'>Categories</h3>
        <div className='exploreCategories'>
          <Link to={'/category/rent'}>
            <img
              src={rentCategoryIMG}
              alt='Rent'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Places for rent</p>
          </Link>
          <Link to={'/category/sale'}>
            <img
              src={sellCategoryIMG}
              alt='Sale'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explore;
