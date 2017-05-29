// Just use mongo shell for now, or copy and paste to mLab
//use first initial and lastname; add numbers to the end if necessary
db.users.update(
    {'email' : 'jdegrave@earthlink.net' },

    {
        local : {
                    admin : true,
                    username: 'jdegrave',
                    uFirstName: 'Jodi',
                    uLastName: 'DeGrave',
                    email: 'jdegrave@earthlink.net',
                    password: 'ABC123yes!'
                }

    },
    { upsert : true }
);
db.users.update(
    {'email' : 'guest@guest.com' },

    {
        local : {
                    admin : false,
                    username: 'guest01',
                    uFirstName: 'Test',
                    uLastName: 'Guest',
                    email: 'guest@guest.com',
                    password: 'P@ssword2!'
                }

    },
    { upsert : true }
);
