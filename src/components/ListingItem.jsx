import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import BedIcon from '../assets/svg/bedIcon.svg';
import BathtubIcon from '../assets/svg/bathtubIcon.svg';
import EditIcon from '../assets/svg/editIcon.svg?react';
import DeleteIcon from '../assets/svg/deleteIcon.svg?react';

const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li className='categoryListing'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='categoryListingLink'>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className='categoryListingImg'
        />
        <div className='categoryListingDetails'>
          <span className='categoryListingLocation'>{listing.location}</span>
          <h3 className='categoryListingName'>{listing.name}</h3>
          <p className='categoryListingPrice'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className='categoryListingInfoDiv'>
            <img src={BedIcon} alt='Bed' />
            <p className='categoryListingInfoText'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : '1 Bedroom'}
            </p>
            <img src={BathtubIcon} alt='Bathtub' />
            <p className='categoryListingInfoText'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className='removeIcon'
          fill='#7743db'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
      {onEdit && (
        <EditIcon
          className='editIcon'
          fill='#7743db'
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};

ListingItem.propTypes = {
  id: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  listing: PropTypes.object,
};

export default ListingItem;
