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
import useModelItem from 'hooks/useModelItem';
import { ROUTES } from 'app/constants';
import { getModelDetailsRoute } from 'services/RoutingService';

const initialState = {name: '', description: '', categories: []};

const ModelForm = () => {
    let {id} = useParams();
    const formRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const isMountedRef = useRef(true);
    const [hasError, setHasError] = useState(false);
    const {saveModelItem, removeModelItem} = useModelItem(id);
    const [formData, setFormData] = useState(initialState);
    const [renamedCategories, setRenamedCategories] = useState({});
    const [modelContext] = useState({setFormData, setRenamedCategories});
    modelContext.formData = formData;
    modelContext.renamedCategories = renamedCategories;

    const handleError = () => {
        if (!isMountedRef.current) return;
        setHasError(true);
    };

    const handleChange = (field, value) => {
        setFormData({...formData, [field]: value});
    };

    useEffect(() => {
        setIsFormValid(formRef.current && formRef.current.checkValidity() && formData.categories.length > 1);
        return () => isMountedRef.current = false;
    }, [formData.name, formData.description, formData.categories]);

    useEffect(() => {
        if (id && !formData.id) {
            const handleResponse = result => {
                if (!isMountedRef.current) return;
                if (result) {
                    setHasError(false);
                    setFormData(result);
                } else handleError();
            };
            ModelService.getModelItem(id)
                .then(handleResponse)
                .catch(handleError);
        }
        return () => isMountedRef.current = false;
    }, [id, formData.id]);

    return (
        <ModelContext.Provider value={modelContext}>
            <Page addBottomBarPadding={true}>
                <TopBar title='Model Form' backPath={id ? getModelDetailsRoute(id) : ROUTES.HOME}>
                    {formData.id && !formData.isCommunityModel ? <ModelDeleter formData={formData} removeModelItem={removeModelItem}/> : null}
                </TopBar>
                {hasError ? <Message.Error/> : null}
                <form ref={formRef} className={styles.form} noValidate autoComplete="off">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledTextField label="Name" value={formData.name} variant="outlined" required={true}
                                             fullWidth
                                             onChange={e => handleChange('name', e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <StyledTextField label="Short Description"
                                             value={formData.description}
                                             variant="outlined"
                                             required={true}
                                             fullWidth
                                             onChange={e => handleChange('description', e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Categories (2 minimum) :</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <CategoryAdder/>
                        </Grid>
                        <Grid item xs={12}>
                            <CategoryList categories={formData.categories}/>
                        </Grid>
                    </Grid>
                </form>
                <ModelSaveBar saveModelItem={saveModelItem} isFormValid={isFormValid} formData={formData} renamedCategories={renamedCategories}/>
            </Page>
        </ModelContext.Provider>
    );
};

export default ModelForm;
