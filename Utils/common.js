const formatDate = (date) => {
    const _date = new Date(date);
    const year = _date.getFullYear();
    const mon = _date.getMonth() + 1;
    const day = _date.date();

    const hour = _date.getHours()
    const min = _date.getMinutes()
    const sec = _date.getSeconds()
    return `${year >= 10 ? year : `0${year}`}-${mon >= 10 ? mon : `0${mon}`}-${day >= 10 ? day : `0${day}`} ${hour >= 10 ? hour : `0${hour}`}:${min >= 10 ? min : `0${min}`}:${sec >= 10 ? sec : `0${sec}`} `
}


module.exports = {
    formatDate
}
