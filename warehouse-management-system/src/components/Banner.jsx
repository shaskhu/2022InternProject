import { Alert } from '@aws-amplify/ui-react';

const Banner = ({ heading, message }) => {
	return (
		<Alert isDismissible={true} hasIcon={true} heading={heading}>
			{message}
		</Alert>
	);
};

export default Banner;
