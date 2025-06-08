
export const formatDateCroatian = (dateInput) => {
  if (!dateInput) return 'N/A';

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    let formatted = date.toLocaleDateString('hr-HR', options);
    if (!formatted.endsWith('.')) {
      formatted += '.';
    }
    return formatted;

  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return 'Neispravan datum';
  }
};

export const formatCurrencyEuroCroatian = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'N/A';
  }

  try {
    const numberAmount = Number(amount);

    const options = {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    return numberAmount.toLocaleString('hr-HR', options);

  } catch (error) {
    console.error("Error formatting currency:", amount, error);
    return 'N/A';
  }
};

export const formatRoleCroatian = (role) => {
  const roleMap = {
    Admin: 'Administrator',
    Moderator: 'Moderator',
    Regular: 'Korisnik',
  };
  return roleMap[role] || role;
}

export const formatProposalStatusCroatian = (status) => {
  const statusMap = {
    Active: 'U tijeku',
    Completed: 'Završen'
  }
  return statusMap[status] || status;
}
