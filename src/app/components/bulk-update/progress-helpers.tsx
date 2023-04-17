type ProgressLabelState = 'loading' | 'error' | 'success';

export const progressLabel = (status: ProgressLabelState) => {
  if (status === 'loading') {
    return 'Updating...';
  }
  if (status === 'error') {
    return 'Error! At least one configuration was not updated.';
  }

  return 'Success! Updated configurations.';
};

export const progressVariant = (status: ProgressLabelState) => {
  if (status === 'error') {
    return 'critical';
  }
  if (status === 'success') {
    return 'success';
  }

  return 'primary';
};
