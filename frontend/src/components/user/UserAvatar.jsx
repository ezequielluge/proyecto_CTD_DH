import React from 'react'

const UserAvatar = ({ firstname, lastname }) => {
    const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

    const avatarStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#1E3A5F',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    return <div style={avatarStyle}>{initials}</div>;
};

export default UserAvatar