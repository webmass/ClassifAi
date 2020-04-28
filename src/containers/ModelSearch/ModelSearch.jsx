import Page from 'components/Page/Page';
import TopBar from 'components/TopBar/TopBar';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import { updateLastSearchValue } from 'store/slices/searchSlice';
import styles from './ModelSearch.module.scss';
import ModelList from 'components/Model/ModelList/ModelList';
import ArweaveService from 'services/ArweaveService';
import { useParams } from 'react-router-dom';
import { SEARCH_TYPES } from 'app/constants';
import AppContext from 'app/AppContext';
import Message from 'components/Message/Message';
import StyledTextField from 'components/StyledTextField/StyledTextField';

const ModelSearch = ({localModels, lastSearchValue, updateLastSearchValue}) => {
    const {wallet} = useContext(AppContext);
    const {searchType} = useParams();
    const [searchValue, setSearchValue] = useState(lastSearchValue);
    const isMountedRef = useRef(true);
    const isCommunitySearch = searchType === SEARCH_TYPES.community;
    const [models, setModels] = useState(isCommunitySearch ? [] : localModels);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleCommunityError = () => {
        setModels([]);
        setHasError(true);
    };

    const getCommunityModels = () => {
        setIsLoading(true);
        ArweaveService.getAllModels()
            .then(result => isMountedRef.current ? setModels(result.data) : null)
            .finally(() => isMountedRef.current ? setIsLoading(false) : null)
            .catch(handleCommunityError)
    };


    const search = useCallback((value) => {
        const searchRegEx = new RegExp(`${value}`, 'i');
        const searchResult = models.filter(modelItem => {
            return modelItem.name.match(searchRegEx) || modelItem.description.match(searchRegEx);
        });
        return searchResult;
    }, [models]);

    const [filteredModels, setFilteredModels] = useState(search(lastSearchValue));

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
        const value = event.target.value.trim();
        updateLastSearchValue(value);
    };

    useEffect(() => {
        isMountedRef.current = true;
        if (isCommunitySearch && wallet) {
            getCommunityModels();
        }
        return () => isMountedRef.current = false;
    }, [wallet, isCommunitySearch]);

    useEffect(() => {
        setFilteredModels(search(searchValue));
    }, [searchValue, search]);

    return (
        <Page hasTopBar={true} className={styles.container}>
            <TopBar>
                <span className={styles.searchInputContainer}>
                    <StyledTextField
                        value={searchValue}
                        autoFocus
                        placeholder={`Search in ${isCommunitySearch ? 'community' : 'my'} models`}
                        className={styles.searchInput}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search/></InputAdornment>,
                        }}/>
                </span>
            </TopBar>
            <div className={styles.container}>
                {hasError ? <Message.Error>Could not fetch community models, are you connected to the Internet ?</Message.Error> : null}
                {isLoading ? <Message.Loading/> : <ModelList models={filteredModels}/>}
            </div>
        </Page>
    );
};

export default connect(
    state => ({localModels: state.models, lastSearchValue: state.lastSearchValue}),
    {updateLastSearchValue}
)(ModelSearch)
