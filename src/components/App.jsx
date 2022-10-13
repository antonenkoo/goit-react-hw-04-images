import React, { useState } from 'react';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import LoadMoreButton from './Button/Button';
import FetchFn from './api/api';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';

import './styles.css';

export function App() {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalLargeImage, setModalLargeImage] = useState('');
  const [modal, setModal] = useState(false);

  const handleSubmit = async (searchQuery, page) => {
    if (currentSearchQuery !== searchQuery) {
      try {
        setLoader(true);
        return await FetchFn(searchQuery, 1).then(res => {
          setSearchResult(res.hits);
          setPage(page + 1);
          setCurrentSearchQuery(searchQuery);

          if (res.hits.length > 11 && res.totalHits > 12) {
            setLoadMore(true);
          }
        });
      } catch (error) {
      } finally {
        setLoader(false);
      }
    }

    try {
      setLoader(true);
      return await FetchFn(searchQuery, page).then(res => {
        setSearchResult([...searchResult, ...res.hits]);
        setPage(page + 1);
        setCurrentSearchQuery(searchQuery);

        if (res.hits.length > 11 && res.totalHits > 12) {
          setLoadMore(true);
        }
      });
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };
  const handleClick = largeImage => {
    setModalLargeImage(largeImage);
    setModal(true);
  };
  const handleChange = e => {
    setValue(e.target.value);
  };

  const loadMoreClick = async () => {
    handleSubmit(value, page);
  };

  const modalClose = () => {
    setModal(false);
  };

  return (
    <div className="App">
      <>
        <Searchbar
          onSubmit={handleSubmit}
          onChange={handleChange}
          page={page}
          value={value}
        />

        <ImageGallery images={searchResult} page={page} onClick={handleClick} />
        {loader ? (
          <Loader />
        ) : (
          <LoadMoreButton
            onClick={loadMoreClick}
            buttonStatus={loadMore}
            images={searchResult}
          />
        )}

        {modal && <Modal largeImage={modalLargeImage} onClose={modalClose} />}
      </>
    </div>
  );
}
