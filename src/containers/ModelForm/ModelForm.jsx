import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid } from '@material-ui/core';
import Page from 'components/Page/Page';
import StyledTextField from 'components/StyledTextField/StyledTextField';
import CategoryList from 'components/Category/CategoryList/CategoryList';
import CategoryAdder from 'components/Category/CategoryAdder/CategoryAdder';
import TopBar from 'components/TopBar/TopBar';
import ModelContext from 'components/Model/ModelContext';
import styles from './ModelForm.module.scss';
import Message from 'components/Message/Message';
import ModelDeleter from 'components/Model/ModelDeleter/ModelDeleter';
import ModelSaveBar from 'components/Model/ModelSaveBar/ModelSaveBar';
import ModelService from 'services/ModelService';

const initialState = {name: '', description: '', categories: []};

const ModelForm = () => {
    let {id} = useParams();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const isMountedRef = useRef(true);
    const [modelItem, setModelItem] = useState(initialState);
    const [renamedCategories, setRenamedCategories] = useState({});
    const [modelContext] = useState({setModelItem, setRenamedCategories});
    modelContext.modelItem = modelItem;
    modelContext.renamedCategories = renamedCategories;
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!isMountedRef.current) return;
        setHasError(true);
    };

    const handleChange = (field, value) => {
        setModelItem({...modelItem, [field]: value});
    };

    useEffect(() => {
        setIsFormValid(formRef.current && formRef.current.checkValidity() && modelItem.categories.length > 1);
        return () => isMountedRef.current = false;
    }, [modelItem.name, modelItem.description, modelItem.categories]);

    useEffect(() => {
        if (id && !modelItem.id) {
            const handleResponse = result => {
                if (!isMountedRef.current) return;
                if (result) {
                    setHasError(false);
                    setModelItem(result);
                } else handleError();
            };
            ModelService.getModelItem(id)
                .then(handleResponse)
                .catch(handleError);
        }
        return () => isMountedRef.current = false;
    }, [id, modelItem.id]);

    return (
        <ModelContext.Provider value={modelContext}>
            <Page hasBottomBar={true}>
                <TopBar title='Model Form'>
                    {modelItem.id && !modelItem.isCommunityModel ? <ModelDeleter modelItem={modelItem}/> : null}
                </TopBar>
                {hasError ? <Message.Error/> : null}
                <form ref={formRef} className={styles.form} noValidate autoComplete="off">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledTextField label="Name" value={modelItem.name} variant="outlined" required={true}
                                             fullWidth
                                             onChange={e => handleChange('name', e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <StyledTextField label="Description"
                                             value={modelItem.description}
                                             variant="outlined"
                                             multiline={true}
                                             required={true}
                                             fullWidth
                                             rows={2}
                                             rowsMax={3}
                                             onChange={e => handleChange('description', e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Categories (2 minimum) :</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <CategoryAdder/>
                        </Grid>
                        <Grid item xs={12}>
                            <CategoryList categories={modelItem.categories}/>
                        </Grid>
                    </Grid>
                </form>
                <ModelSaveBar isFormValid={isFormValid} modelItem={modelItem} renamedCategories={renamedCategories}/>
            </Page>
        </ModelContext.Provider>
    );
};

export default ModelForm;
