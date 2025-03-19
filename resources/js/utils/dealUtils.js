export const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(value);
};

export const updateDealsState = (deals, dealId, newStatus) => {
    const updatedDeals = { ...deals };
    let movedDeal = null;
    
    // Находим и удаляем сделку из текущего статуса
    Object.entries(updatedDeals).forEach(([status, dealsList]) => {
        const index = dealsList.findIndex(deal => deal.id === dealId);
        if (index !== -1) {
            movedDeal = dealsList[index];
            updatedDeals[status] = dealsList.filter(deal => deal.id !== dealId);
        }
    });
    
    // Добавляем сделку в новый статус
    if (movedDeal) {
        movedDeal.status = newStatus;
        if (!updatedDeals[newStatus]) {
            updatedDeals[newStatus] = [];
        }
        updatedDeals[newStatus].push(movedDeal);
    }

    return updatedDeals;
}; 