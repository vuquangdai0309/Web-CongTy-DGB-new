function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return parts[2] + '-' + parts[1] + '-' + parts[0];
    }
    return dateString;
}
module.exports = { formatDate }