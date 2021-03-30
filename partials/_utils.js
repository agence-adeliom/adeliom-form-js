import {copy} from "dauphine-js";

export const getFormData = (answers) => {
    let formData = new FormData();
    answers.forEach((element) => {
        const answer = JSON.parse(element);
        if(Array.isArray(answer)){
            answer.forEach((field) => {
                const value = typeof field.value === "string" ? field.value : field.value.join();
                formData.append("input_" + field.name, value);
            });
        }
        else{
            formData.append("input_" + answer.name, answer.value);
        }
    });
    return formData;
};

export const getConditionalFields = (json, answers=null) => {
    const previousAnswers = answers ? answers :  history.state &&  history.state.answers ?  history.state.answers : null;
    const newJSON = copy(json);
    if(newJSON.fields && previousAnswers) {
        newJSON.fields.forEach((field, index) => {
            if(field.conditional){
                const answersDatas = getAnswers(previousAnswers);
                if(answersDatas[field.conditional.key] !== field.conditional.value){
                    newJSON.fields.splice(index, 1);
                }
            }
        });
    }
    return newJSON;
};

export const getSummaryData = (answers, step) => {
    let datas = [];
    answers.forEach((element, index) => {
        const answer = JSON.parse(element);
        if (Array.isArray(answer)) {
            answer.forEach((field) => {
                if (index < step && field.summary) {
                    let value = typeof field.value === "string" ? field.value : field.value.join(', ');


                    const index = datas.findIndex(el => {
                        return el.title === field.summary;
                    });

                    if (field.summaryLabel) {
                        value = field.summaryLabel.replace('%value%', field.value);
                    }

                    if (index !== -1) {
                        if (typeof datas[index].value === "string") {
                            datas[index].value = [datas[index].value, value];
                        } else {
                            datas[index].value = datas[index].value.concat([value]);
                        }
                    } else {
                        datas.push({
                            title: field.summary,
                            value: value
                        });
                    }
                }
            });
        } else {
            if (index < step && answer.summary) {
                const value = typeof answer.value === "string" ? answer.value : answer.value.join(', ');


                datas.push({
                    title: answer.summary,
                    value: value
                });
            }
        }
    });
    return datas;
};
