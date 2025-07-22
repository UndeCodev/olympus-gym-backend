import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const main = async () => {
  const existingCompany = await prisma.company_info.findFirst();

  if (existingCompany) {
    console.log('Company info already exists, skipping seed...');
    return;
  }

  await prisma.company_info.create({
    data: {
      logo: 'https://res.cloudinary.com/dxhd2qugi/image/upload/v1752039252/olympus_gym/logos/olympus-gym_qqtzkr.png',
      name: 'Olympus GYM',
      slogan: 'Entrena fuerte, vive mejor',
      address: '2° piso callejon del beso, col. centro, Atlapexco, Mexico',
      zip: '43060',
      email: 'contacto@olympus-gym-atlapexco.com',
      schedule: [
        { days: 'Lunes a Viernes', open: '6:00 A.M.', close: '10:00 P.M.' },
        { days: 'Sábados', open: '10:00 A.M.', close: '2:00 P.M.' },
      ],
      socialMedia: [
        {
          platform: 'Facebook',
          url: 'https://www.facebook.com/people/Olympus-Gym-Atlapexco/100095299885865/',
        },
      ],
    },
  });

  console.log('Olympus GYM company profile created successfully!');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
