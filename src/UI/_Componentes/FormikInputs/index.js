import React from "react";
import classNames from "classnames";

import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export const getInputText = (field, formProps, classes, props) => {
    const error = (formProps.touched[props.name] &&
        formProps.errors[props.name]);

    return <TextField
        {...field}
        className={classNames(classes.wideWidth)}
        label={props.label || ""}
        placeholder={props.placeholder || ""}
        error={error || false}
        helperText={error && formProps.errors[props.name]}
        margin="none"
        type="text"
        InputLabelProps={{
            shrink: true,
        }}
        inputProps={{
            className: classNames(classes.wideWidth),
            classes: {
                root: classes.textArea
            },
            maxLength: props.maxLength || 50,
        }}
        FormHelperTextProps={{
            className: classes.errorText
        }}
        multiline={props.multiline || false}
    />;
}


export const getDatePicker = (field, formProps, classes, props) => {
    const error = (formProps.touched[props.name] &&
        formProps.errors[props.name]);

    return <TextField
        {...field}
        label={props.label || ""}
        placeholder={props.placeholder || ""}
        error={error || false}
        helperText={error && formProps.errors[props.name]}
        type={'date'}
        className={classNames(classes.wideWidth)}
        margin="none"
        format={'dd/MM/YYYY'}
        InputLabelProps={{
            shrink: true,
        }}
        inputProps={{
            className: classes.wideWidth
        }}
        FormHelperTextProps={{
            className: classes.errorText
        }}
        inputProps={{
            maxLength: props.maxLength || 50,
        }}
        className={classes.inputDate}
    />
}

export const getSelect = (field, formProps, classes, props) => {
    const randomId = (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));
    const error = (formProps.touched[props.name] &&
        formProps.errors[props.name]);

    return <FormControl className={classNames(classes.formControl, classes.wideWidth)}>
        <InputLabel shrink htmlFor={randomId + '-label-placeholder'}>{props.label}</InputLabel>
        <Select
            {...field}
            error={error || false}
            input={<Input id={randomId + '-label-placeholder'} />}
            displayEmpty
            placeholder={props.placeholder}
        >

            {props.itemsSelect && props.itemsSelect.map((item) => {
                return <MenuItem value={item.value}>{item.label}</MenuItem>;
            })}
        </Select>
        <FormHelperText className={classes.errorText}>{error && formProps.errors[props.name]}</FormHelperText>
    </FormControl>;
}