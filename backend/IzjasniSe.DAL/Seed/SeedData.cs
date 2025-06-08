using IzjasniSe.Model.Entities;
using IzjasniSe.Model.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace IzjasniSe.DAL.Seed
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

                try
                {
                    if (await context.Users.AnyAsync())
                    {
                        logger.LogInformation("Database already seeded.");
                        return;
                    }
                    logger.LogInformation("Initializing seed data...");
                    await SeedDatabaseAsync(context);
                    logger.LogInformation("Seed data initialization complete.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred during database seeding.");
                }
            }
        }

        private static async Task SeedDatabaseAsync(AppDbContext context)
        {
            var passwordHasher = new PasswordHasher<User>();

            var zagreb = new City { Name = "Zagreb", Postcode = "10000", CreatedAt = DateTime.UtcNow };
            var split = new City { Name = "Split", Postcode = "21000", CreatedAt = DateTime.UtcNow };
            var rijeka = new City { Name = "Rijeka", Postcode = "51000", CreatedAt = DateTime.UtcNow };
            var osijek = new City { Name = "Osijek", Postcode = "31000", CreatedAt = DateTime.UtcNow };
            var zadar = new City { Name = "Zadar", Postcode = "23000", CreatedAt = DateTime.UtcNow };
            var pula = new City { Name = "Pula", Postcode = "52100", CreatedAt = DateTime.UtcNow };
            var varazdin = new City { Name = "Varaždin", Postcode = "42000", CreatedAt = DateTime.UtcNow };
            var dubrovnik = new City { Name = "Dubrovnik", Postcode = "20000", CreatedAt = DateTime.UtcNow };
            var sibenik = new City { Name = "Šibenik", Postcode = "22000", CreatedAt = DateTime.UtcNow };
            var karlovac = new City { Name = "Karlovac", Postcode = "47000", CreatedAt = DateTime.UtcNow };

            var cities = new List<City> { zagreb, split, rijeka, osijek, zadar, pula, varazdin, dubrovnik, sibenik, karlovac };
            await context.Cities.AddRangeAsync(cities);
            await context.SaveChangesAsync();

            var adminUser = new User { UserName = "admin", Email = "admin@izjasnise.hr", Role = UserRole.Admin, AccountStatus = UserAccountStatus.Active, City = null, CreatedAt = DateTime.UtcNow };

            var modZg = new User { UserName = "moderatorZg", Email = "moderator@zg.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = zagreb, CreatedAt = DateTime.UtcNow };
            var modSt = new User { UserName = "moderatorSt", Email = "moderator@st.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = split, CreatedAt = DateTime.UtcNow };
            var modRi = new User { UserName = "moderatorRi", Email = "moderator@ri.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = rijeka, CreatedAt = DateTime.UtcNow };
            var modOs = new User { UserName = "moderatorOs", Email = "moderator@os.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = osijek, CreatedAt = DateTime.UtcNow };
            var modZd = new User { UserName = "moderatorZd", Email = "moderator@zd.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = zadar, CreatedAt = DateTime.UtcNow };
            var modPu = new User { UserName = "moderatorPu", Email = "moderator@pu.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = pula, CreatedAt = DateTime.UtcNow };
            var modVz = new User { UserName = "moderatorVz", Email = "moderator@vz.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = varazdin, CreatedAt = DateTime.UtcNow };
            var modDu = new User { UserName = "moderatorDu", Email = "moderator@du.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = dubrovnik, CreatedAt = DateTime.UtcNow };
            var modSi = new User { UserName = "moderatorSi", Email = "moderator@si.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = sibenik, CreatedAt = DateTime.UtcNow };
            var modKa = new User { UserName = "moderatorKa", Email = "moderator@ka.izjasnise.hr", Role = UserRole.Moderator, AccountStatus = UserAccountStatus.Active, City = karlovac, CreatedAt = DateTime.UtcNow };

            var user1 = new User { UserName = "marko.horvat", Email = "marko.horvat@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = zagreb, CreatedAt = DateTime.UtcNow };
            var user2 = new User { UserName = "ana.kovacevic", Email = "ana.kovacevic@outlook.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = split, CreatedAt = DateTime.UtcNow };
            var user3 = new User { UserName = "ivan.babic", Email = "ivan.babic@yahoo.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = rijeka, CreatedAt = DateTime.UtcNow };
            var user4 = new User { UserName = "petra.novak", Email = "petra.novak@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = zagreb, CreatedAt = DateTime.UtcNow };
            var user5 = new User { UserName = "luka.maric", Email = "luka.maric@hotmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = split, CreatedAt = DateTime.UtcNow };
            var user6 = new User { UserName = "maja.juric", Email = "maja.juric@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = osijek, CreatedAt = DateTime.UtcNow };
            var user7 = new User { UserName = "tomislav.pavlovic", Email = "tomislav.pavlovic@outlook.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = zadar, CreatedAt = DateTime.UtcNow };
            var user8 = new User { UserName = "martina.bozic", Email = "martina.bozic@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = pula, CreatedAt = DateTime.UtcNow };
            var user9 = new User { UserName = "josip.matic", Email = "josip.matic@yahoo.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = varazdin, CreatedAt = DateTime.UtcNow };
            var user10 = new User { UserName = "ivana.petrovic", Email = "ivana.petrovic@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = dubrovnik, CreatedAt = DateTime.UtcNow };
            var user11 = new User { UserName = "antonio.jukic", Email = "antonio.jukic@outlook.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = sibenik, CreatedAt = DateTime.UtcNow };
            var user12 = new User { UserName = "katarina.radic", Email = "katarina.radic@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = karlovac, CreatedAt = DateTime.UtcNow };
            var user13 = new User { UserName = "matej.kovac", Email = "matej.kovac@hotmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = zagreb, CreatedAt = DateTime.UtcNow };
            var user14 = new User { UserName = "lucija.stojanovic", Email = "lucija.stojanovic@gmail.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = split, CreatedAt = DateTime.UtcNow };
            var user15 = new User { UserName = "nikola.milic", Email = "nikola.milic@yahoo.com", Role = UserRole.Regular, AccountStatus = UserAccountStatus.Active, City = rijeka, CreatedAt = DateTime.UtcNow };

            var users = new List<User> {
                adminUser, modZg, modSt, modRi, modOs, modZd, modPu, modVz, modDu, modSi, modKa,
                user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12, user13, user14, user15
            };

            users[0].PasswordHash = passwordHasher.HashPassword(users[0], "AdminPass123!");
            for (int i = 1; i <= 10; i++)
            {
                users[i].PasswordHash = passwordHasher.HashPassword(users[i], "ModeratorPass123!");
            }
            for (int i = 11; i < users.Count; i++)
            {
                users[i].PasswordHash = passwordHasher.HashPassword(users[i], "UserPass123!");
            }

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            var locations = new List<Location>
            {
                new Location { Name = "Trg bana Jelačića", Address = "Trg bana Josipa Jelačića", City = zagreb, Latitude = 45.8131, Longitude = 15.9772, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Park Maksimir - Glavni ulaz", Address = "Maksimirski perivoj", City = zagreb, Latitude = 45.8244, Longitude = 16.0175, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Bundek - Glavno jezero", Address = "Bundek", City = zagreb, Latitude = 45.7858, Longitude = 15.9860, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Jarun - Rekreacijski centar", Address = "Aleja Matije Ljubeka", City = zagreb, Latitude = 45.7775, Longitude = 15.9096, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Gornji grad - Kamenita vrata", Address = "Kamenita ul.", City = zagreb, Latitude = 45.8148, Longitude = 15.9761, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Botanički vrt", Address = "Marulićev trg 9a", City = zagreb, Latitude = 45.8072, Longitude = 15.9683, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Riva - Glavna šetnica", Address = "Obala Hrvatskog narodnog preporoda", City = split, Latitude = 43.5081, Longitude = 16.4402, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Plaža Bačvice", Address = "Prilaz braće Kaliterna", City = split, Latitude = 43.5030, Longitude = 16.4491, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Dioklecijanova palača", Address = "Dioklecijanova ul.", City = split, Latitude = 43.5081, Longitude = 16.4402, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Marjan - Vidilica", Address = "Park šuma Marjan", City = split, Latitude = 43.5093, Longitude = 16.4097, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Plaža Žnjan", Address = "Žnjan", City = split, Latitude = 43.5022, Longitude = 16.4851, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Korzo - Centar", Address = "Korzo", City = rijeka, Latitude = 45.3271, Longitude = 14.4422, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Trsat - Gradina", Address = "Petra Zrinskog", City = rijeka, Latitude = 45.3293, Longitude = 14.4565, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Delta", Address = "Delta", City = rijeka, Latitude = 45.3490, Longitude = 14.4046, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Kantrida - Bazen", Address = "Preluk 1", City = rijeka, Latitude = 45.3347, Longitude = 14.3927, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Tvrđa - Trg Sv. Trojstva", Address = "Trg Svetog Trojstva", City = osijek, Latitude = 45.5605, Longitude = 18.6778, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Promenada uz Dravu", Address = "Šetalište kardinala Franje Šepera", City = osijek, Latitude = 45.5511, Longitude = 18.6952, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Gradski vrt", Address = "Vukovarska ul.", City = osijek, Latitude = 45.5511, Longitude = 18.6947, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Kopika", Address = "Vijenac Ivana Česmičkog", City = osijek, Latitude = 45.5547, Longitude = 18.7285, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Forum", Address = "Poljana pape Aleksandra III", City = zadar, Latitude = 44.1157, Longitude = 15.2246, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Pozdrav Suncu", Address = "Istarska obala", City = zadar, Latitude = 44.1185, Longitude = 15.2192, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Morske orgulje", Address = "Obala kralja Petra Krešimira IV", City = zadar, Latitude = 44.1196, Longitude = 15.2191, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Plaža Kolovare", Address = "Kolovare", City = zadar, Latitude = 44.1232, Longitude = 15.2115, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Arena Pula", Address = "Flavijevska ulica", City = pula, Latitude = 44.8732, Longitude = 13.8503, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Zlatna vrata", Address = "Carrarina ul.", City = pula, Latitude = 44.8726, Longitude = 13.8486, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Kaštel", Address = "Gradinski uspon 6", City = pula, Latitude = 44.8714, Longitude = 13.8474, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Stari grad Varaždin", Address = "Šetalište Josipa Jurja Strossmayera", City = varazdin, Latitude = 46.3044, Longitude = 16.3378, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Trg kralja Tomislava", Address = "Trg kralja Tomislava", City = varazdin, Latitude = 46.3076, Longitude = 16.3362, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Gradski park", Address = "Park Josipa Jurja Strossmayera", City = varazdin, Latitude = 46.3040, Longitude = 16.3419, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Stradun", Address = "Stradun", City = dubrovnik, Latitude = 42.6409, Longitude = 18.1082, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Gradske zidine", Address = "Placa ulica 32", City = dubrovnik, Latitude = 42.6411, Longitude = 18.1066, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Lokrum", Address = "Otok Lokrum", City = dubrovnik, Latitude = 42.6275, Longitude = 18.1217, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Katedrala sv. Jakova", Address = "Trg Republike Hrvatske", City = sibenik, Latitude = 43.7362, Longitude = 15.8906, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Tvrđava sv. Mihovila", Address = "Tvrđava sv. Mihovila", City = sibenik, Latitude = 43.7350, Longitude = 15.8880, CreatedAt = DateTime.UtcNow },
                
                new Location { Name = "Stari grad Dubovac", Address = "Zagrebačka ulica", City = karlovac, Latitude = 45.4929, Longitude = 15.5553, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Foginovo kupalište", Address = "Rakovac", City = karlovac, Latitude = 45.4804, Longitude = 15.5765, CreatedAt = DateTime.UtcNow },
                new Location { Name = "Zvijezda - gradski park", Address = "Stjepana Radića", City = karlovac, Latitude = 45.4887, Longitude = 15.5508, CreatedAt = DateTime.UtcNow }
            };
            await context.Locations.AddRangeAsync(locations);
            await context.SaveChangesAsync();

            var proposals = new List<Proposal>
            {
                new Proposal { Name = "Obnova dječjeg igrališta Maksimir", Description = "Zamjena starih sprava i postavljanje nove gumene podloge.", MaxBudget = 50000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-30), SubmissionEnd = DateTime.UtcNow.AddDays(30), Status = ProposalStatus.Active, City = zagreb, Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-35) },
                new Proposal { Name = "Program 'Čitam ti priču' u parkovima", Description = "Organizacija čitanja priča za djecu u gradskim parkovima tijekom ljeta.", MaxBudget = 5000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-5), SubmissionEnd = DateTime.UtcNow.AddDays(25), Status = ProposalStatus.Active, City = zagreb, Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-10) },
                new Proposal { Name = "Uređenje biciklističkih staza na Jarunu", Description = "Proširenje i modernizacija biciklističkih staza oko jezera.", MaxBudget = 80000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-20), SubmissionEnd = DateTime.UtcNow.AddDays(40), Status = ProposalStatus.Active, City = zagreb, Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-25) },
                new Proposal { Name = "Advent u Gornjem gradu", Description = "Organizacija adventskih štandova i programa.", MaxBudget = 120000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-90), SubmissionEnd = DateTime.UtcNow.AddDays(-30), Status = ProposalStatus.Completed, City = zagreb, Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-95) },
                
                new Proposal { Name = "Postavljanje javnih klupa na Rivi", Description = "Dodavanje 15 novih klupa duž splitske Rive.", MaxBudget = 15000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-20), SubmissionEnd = DateTime.UtcNow.AddDays(10), Status = ProposalStatus.Active, City = split, Moderator = modSt, CreatedAt = DateTime.UtcNow.AddDays(-25) },
                new Proposal { Name = "Uređenje plaže Bačvice", Description = "Postavljanje novih tuševa i kabina za presvlačenje.", MaxBudget = 35000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-15), SubmissionEnd = DateTime.UtcNow.AddDays(30), Status = ProposalStatus.Active, City = split, Moderator = modSt, CreatedAt = DateTime.UtcNow.AddDays(-20) },
                new Proposal { Name = "Rasvjeta parka Marjan", Description = "Postavljanje solarne rasvjete na glavnim stazama.", MaxBudget = 60000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-10), SubmissionEnd = DateTime.UtcNow.AddDays(50), Status = ProposalStatus.Active, City = split, Moderator = modSt, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                
                new Proposal { Name = "Biciklistička staza uz Korzo", Description = "Izgradnja označene biciklističke staze u centru Rijeke.", MaxBudget = 120000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-60), SubmissionEnd = DateTime.UtcNow.AddDays(60), Status = ProposalStatus.Active, City = rijeka, Moderator = modRi, CreatedAt = DateTime.UtcNow.AddDays(-65) },
                new Proposal { Name = "Lift za Trsat", Description = "Instalacija panoramskog lifta za lakši pristup Trsatu.", MaxBudget = 200000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-40), SubmissionEnd = DateTime.UtcNow.AddDays(20), Status = ProposalStatus.Active, City = rijeka, Moderator = modRi, CreatedAt = DateTime.UtcNow.AddDays(-45) },
                
                new Proposal { Name = "Ozelenjavanje Trga Sv. Trojstva", Description = "Sadnja novih stabala i cvijeća u osječkoj Tvrđi.", MaxBudget = 25000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-45), SubmissionEnd = DateTime.UtcNow.AddDays(-5), Status = ProposalStatus.Completed, City = osijek, Moderator = modOs, CreatedAt = DateTime.UtcNow.AddDays(-50) },
                new Proposal { Name = "Trim staza uz Dravu", Description = "Postavljanje sprava za vježbanje duž promenade.", MaxBudget = 40000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-25), SubmissionEnd = DateTime.UtcNow.AddDays(35), Status = ProposalStatus.Active, City = osijek, Moderator = modOs, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                
                new Proposal { Name = "Postavljanje punionica za električne romobile", Description = "Instalacija 5 stanica za punjenje el. romobila na ključnim lokacijama u Zadru.", MaxBudget = 30000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-10), SubmissionEnd = DateTime.UtcNow.AddDays(50), Status = ProposalStatus.Active, City = zadar, Moderator = modZd, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                new Proposal { Name = "Uređenje plaže Kolovare", Description = "Renovacija pristupnih staza i postavljanje sjenica.", MaxBudget = 45000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-30), SubmissionEnd = DateTime.UtcNow.AddDays(10), Status = ProposalStatus.Active, City = zadar, Moderator = modZd, CreatedAt = DateTime.UtcNow.AddDays(-35) },
                
                new Proposal { Name = "Uređenje šetnice Lungomare", Description = "Popravak oštećenih dijelova šetnice i postavljanje nove rasvjete.", MaxBudget = 75000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-90), SubmissionEnd = DateTime.UtcNow.AddDays(-30), Status = ProposalStatus.Completed, City = pula, Moderator = modPu, CreatedAt = DateTime.UtcNow.AddDays(-95) },
                new Proposal { Name = "WiFi zona oko Arene", Description = "Postavljanje besplatnog WiFi-ja u okolici Arene.", MaxBudget = 20000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-5), SubmissionEnd = DateTime.UtcNow.AddDays(55), Status = ProposalStatus.Active, City = pula, Moderator = modPu, CreatedAt = DateTime.UtcNow.AddDays(-10) },
                
                new Proposal { Name = "Postavljanje reciklažnih otoka", Description = "Povećanje broja reciklažnih otoka za papir, plastiku i staklo.", MaxBudget = 40000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-70), SubmissionEnd = DateTime.UtcNow.AddDays(20), Status = ProposalStatus.Active, City = varazdin, Moderator = modVz, CreatedAt = DateTime.UtcNow.AddDays(-75) },
                new Proposal { Name = "Advent u Starom gradu", Description = "Organizacija božićnog sajma i pratećih sadržaja.", MaxBudget = 90000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-100), SubmissionEnd = DateTime.UtcNow.AddDays(-40), Status = ProposalStatus.Completed, City = varazdin, Moderator = modVz, CreatedAt = DateTime.UtcNow.AddDays(-105) },
                
                new Proposal { Name = "Sustav hlađenja Straduna", Description = "Instalacija raspršivača vode za hlađenje tijekom ljeta.", MaxBudget = 55000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-20), SubmissionEnd = DateTime.UtcNow.AddDays(40), Status = ProposalStatus.Active, City = dubrovnik, Moderator = modDu, CreatedAt = DateTime.UtcNow.AddDays(-25) },
                
                new Proposal { Name = "Uređenje parka kod Katedrale", Description = "Hortikulturno uređenje i postavljanje klupa.", MaxBudget = 30000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-15), SubmissionEnd = DateTime.UtcNow.AddDays(45), Status = ProposalStatus.Active, City = sibenik, Moderator = modSi, CreatedAt = DateTime.UtcNow.AddDays(-20) },
                
                new Proposal { Name = "Obnova Foginovog kupališta", Description = "Renovacija bazena i okolnih sadržaja.", MaxBudget = 150000.00m, SubmissionStart = DateTime.UtcNow.AddDays(-35), SubmissionEnd = DateTime.UtcNow.AddDays(25), Status = ProposalStatus.Active, City = karlovac, Moderator = modKa, CreatedAt = DateTime.UtcNow.AddDays(-40) }
            };
            await context.Proposals.AddRangeAsync(proposals);
            await context.SaveChangesAsync();

            var suggestions = new List<Suggestion>
            {
                new Suggestion { Name = "Nove ljuljačke", Description = "Potrebne su nove, sigurnije ljuljačke.", EstimatedCost = 3500.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[0], Author = user1, Location = locations[1], CreatedAt = DateTime.UtcNow.AddDays(-25) },
                new Suggestion { Name = "Tobogan za manju djecu", Description = "Dodati manji tobogan primjeren za djecu do 3 godine.", EstimatedCost = 4200.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[0], Author = user4, Location = locations[1], CreatedAt = DateTime.UtcNow.AddDays(-24) },
                new Suggestion { Name = "Popravak postojeće penjalice", Description = "Drvena penjalica je oštećena i treba popravak.", EstimatedCost = 2000.00m, Status = SuggestionStatus.UnderReview, Proposal = proposals[0], Author = user13, Location = locations[1], CreatedAt = DateTime.UtcNow.AddDays(-22) },
                new Suggestion { Name = "Gumena podloga ispod svega", Description = "Cijelo igralište treba imati sigurnu gumenu podlogu.", EstimatedCost = 25000.00m, Status = SuggestionStatus.Approved, Proposal = proposals[0], Author = user1, Location = locations[1], CreatedAt = DateTime.UtcNow.AddDays(-20) },
                
                new Suggestion { Name = "Čitanje u Maksimiru", Description = "Organizirati čitanje priča kod glavnog ulaza u Maksimir.", EstimatedCost = 200.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[1], Author = user1, Location = locations[1], CreatedAt = DateTime.UtcNow.AddDays(-4) },
                new Suggestion { Name = "Čitanje na Bundeku", Description = "Organizirati čitanje priča uz jezero Bundek.", EstimatedCost = 200.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[1], Author = user4, Location = locations[2], CreatedAt = DateTime.UtcNow.AddDays(-3) },
                new Suggestion { Name = "Čitanje u Botaničkom vrtu", Description = "Čitanje među biljkama za edukativno iskustvo.", EstimatedCost = 250.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[1], Author = user13, Location = locations[5], CreatedAt = DateTime.UtcNow.AddDays(-2) },
                
                new Suggestion { Name = "Oznake na stazi", Description = "Jasne oznake smjera i kilometraže.", EstimatedCost = 5000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[2], Author = user1, Location = locations[3], CreatedAt = DateTime.UtcNow.AddDays(-18) },
                new Suggestion { Name = "Rasvjeta staze", Description = "LED rasvjeta za večernju vožnju.", EstimatedCost = 15000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[2], Author = user4, Location = locations[3], CreatedAt = DateTime.UtcNow.AddDays(-17) },
                new Suggestion { Name = "Odmorišta sa klupama", Description = "Postavljanje odmorišta svakih 2km.", EstimatedCost = 8000.00m, Status = SuggestionStatus.UnderReview, Proposal = proposals[2], Author = user13, Location = locations[3], CreatedAt = DateTime.UtcNow.AddDays(-16) },
                
                new Suggestion { Name = "Klupe s naslonom", Description = "Sve nove klupe trebaju imati naslon za leđa.", EstimatedCost = 800.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[4], Author = user2, Location = locations[6], CreatedAt = DateTime.UtcNow.AddDays(-18) },
                new Suggestion { Name = "Klupe sa sjenilom", Description = "Barem nekoliko klupa treba imati nadstrešnicu ili sjenilo.", EstimatedCost = 1500.00m, Status = SuggestionStatus.UnderReview, Proposal = proposals[4], Author = user5, Location = locations[6], CreatedAt = DateTime.UtcNow.AddDays(-17) },
                new Suggestion { Name = "Pametne klupe", Description = "Klupe s USB punjenjem i WiFi-jem.", EstimatedCost = 3000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[4], Author = user14, Location = locations[6], CreatedAt = DateTime.UtcNow.AddDays(-16) },
                
                new Suggestion { Name = "Novi tuševi", Description = "Postavljanje 10 novih tuševa s pitkom vodom.", EstimatedCost = 12000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[5], Author = user2, Location = locations[7], CreatedAt = DateTime.UtcNow.AddDays(-13) },
                new Suggestion { Name = "Kabine za presvlačenje", Description = "5 novih kabina za presvlačenje.", EstimatedCost = 8000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[5], Author = user5, Location = locations[7], CreatedAt = DateTime.UtcNow.AddDays(-12) },
                new Suggestion { Name = "Spasilačka kula", Description = "Nova moderna spasilačka kula.", EstimatedCost = 15000.00m, Status = SuggestionStatus.Approved, Proposal = proposals[5], Author = user14, Location = locations[7], CreatedAt = DateTime.UtcNow.AddDays(-11) },
                
                new Suggestion { Name = "Jasno odvojiti stazu", Description = "Biciklistička staza mora biti jasno odvojena bojom i oznakama od pješačke zone.", EstimatedCost = 10000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[7], Author = user3, Location = locations[11], CreatedAt = DateTime.UtcNow.AddDays(-55) },
                new Suggestion { Name = "Postolja za bicikle", Description = "Postaviti više stalaka za parkiranje bicikala uz stazu.", EstimatedCost = 5000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[7], Author = user15, Location = locations[11], CreatedAt = DateTime.UtcNow.AddDays(-50) },
                new Suggestion { Name = "Semafori za bicikliste", Description = "Posebni semafori za sigurniji promet.", EstimatedCost = 20000.00m, Status = SuggestionStatus.UnderReview, Proposal = proposals[7], Author = user3, Location = locations[11], CreatedAt = DateTime.UtcNow.AddDays(-48) },
                
                new Suggestion { Name = "Više ruža", Description = "Posaditi više vrsta ruža oko spomenika.", EstimatedCost = 1500.00m, Status = SuggestionStatus.Implemented, Proposal = proposals[9], Author = user6, Location = locations[15], CreatedAt = DateTime.UtcNow.AddDays(-40) },
                new Suggestion { Name = "Fontana u centru", Description = "Mala dekorativna fontana.", EstimatedCost = 8000.00m, Status = SuggestionStatus.Implemented, Proposal = proposals[9], Author = user6, Location = locations[15], CreatedAt = DateTime.UtcNow.AddDays(-38) },
                
                new Suggestion { Name = "Punionice kod Foruma", Description = "Jedna punionica treba biti blizu Foruma.", EstimatedCost = 6000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[11], Author = user7, Location = locations[19], CreatedAt = DateTime.UtcNow.AddDays(-8) },
                new Suggestion { Name = "Punionice na Pozdrav Suncu", Description = "Druga punionica kod Pozdrava Suncu.", EstimatedCost = 6000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[11], Author = user7, Location = locations[20], CreatedAt = DateTime.UtcNow.AddDays(-7) },
                new Suggestion { Name = "Punionice uz Morske orgulje", Description = "Treća lokacija uz poznatu atrakciju.", EstimatedCost = 6000.00m, Status = SuggestionStatus.Approved, Proposal = proposals[11], Author = user7, Location = locations[21], CreatedAt = DateTime.UtcNow.AddDays(-6) },
                
                new Suggestion { Name = "Jači signal", Description = "Pojačati signal postojećih pristupnih točaka.", EstimatedCost = 8000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[14], Author = user8, Location = locations[23], CreatedAt = DateTime.UtcNow.AddDays(-4) },
                new Suggestion { Name = "Više pristupnih točaka", Description = "Dodati još 5 pristupnih točaka.", EstimatedCost = 12000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[14], Author = user8, Location = locations[23], CreatedAt = DateTime.UtcNow.AddDays(-3) },
                
                new Suggestion { Name = "Otoci kod Starog grada", Description = "Postaviti jedan set reciklažnih otoka blizu Starog grada.", EstimatedCost = 8000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[15], Author = user9, Location = locations[26], CreatedAt = DateTime.UtcNow.AddDays(-60) },
                new Suggestion { Name = "Otoci na glavnom trgu", Description = "Reciklažni otok na Trgu kralja Tomislava.", EstimatedCost = 8000.00m, Status = SuggestionStatus.Approved, Proposal = proposals[15], Author = user9, Location = locations[27], CreatedAt = DateTime.UtcNow.AddDays(-58) },
                new Suggestion { Name = "Edukacijske table", Description = "Informativne table o važnosti recikliranja.", EstimatedCost = 3000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[15], Author = user9, Location = locations[28], CreatedAt = DateTime.UtcNow.AddDays(-56) },
                
                new Suggestion { Name = "Raspršivači na početku", Description = "Prvi set raspršivača na ulazu u Stradun.", EstimatedCost = 15000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[17], Author = user10, Location = locations[29], CreatedAt = DateTime.UtcNow.AddDays(-18) },
                new Suggestion { Name = "Raspršivači u sredini", Description = "Drugi set na sredini Straduna.", EstimatedCost = 15000.00m, Status = SuggestionStatus.UnderReview, Proposal = proposals[17], Author = user10, Location = locations[29], CreatedAt = DateTime.UtcNow.AddDays(-17) },
                new Suggestion { Name = "Raspršivači na kraju", Description = "Treći set na kraju Straduna.", EstimatedCost = 15000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[17], Author = user10, Location = locations[29], CreatedAt = DateTime.UtcNow.AddDays(-16) },
                
                new Suggestion { Name = "Mediteranske biljke", Description = "Sadnja lavande, ružmarina i drugih mirišljavih biljaka.", EstimatedCost = 5000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[18], Author = user11, Location = locations[32], CreatedAt = DateTime.UtcNow.AddDays(-13) },
                new Suggestion { Name = "Klupe od kamena", Description = "Tradicionalne kamene klupe.", EstimatedCost = 12000.00m, Status = SuggestionStatus.Approved, Proposal = proposals[18], Author = user11, Location = locations[32], CreatedAt = DateTime.UtcNow.AddDays(-12) },
                
                new Suggestion { Name = "Novi skokovi", Description = "Modernizacija skakaonica.", EstimatedCost = 25000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[19], Author = user12, Location = locations[35], CreatedAt = DateTime.UtcNow.AddDays(-30) },
                new Suggestion { Name = "Grijanje vode", Description = "Sustav za grijanje vode u bazenima.", EstimatedCost = 50000.00m, Status = SuggestionStatus.UnderReview, Proposal = proposals[19], Author = user12, Location = locations[35], CreatedAt = DateTime.UtcNow.AddDays(-28) },
                new Suggestion { Name = "Dječji bazen", Description = "Renovacija dječjeg bazena s novim atrakcijama.", EstimatedCost = 35000.00m, Status = SuggestionStatus.Submitted, Proposal = proposals[19], Author = user12, Location = locations[35], CreatedAt = DateTime.UtcNow.AddDays(-26) }
            };
            await context.Suggestions.AddRangeAsync(suggestions);
            await context.SaveChangesAsync();

            var votes = new List<Vote>();
            var random = new Random(42);

            for (int i = 0; i < suggestions.Count; i++)
            {
                var suggestion = suggestions[i];
                var voteCount = random.Next(3, 15);

                var availableUsers = users.Where(u => u.Role == UserRole.Regular).ToList();
                var usersWhoVoted = new HashSet<int>();

                for (int j = 0; j < voteCount && j < availableUsers.Count; j++)
                {
                    var randomUser = availableUsers[random.Next(availableUsers.Count)];
                    if (!usersWhoVoted.Contains(randomUser.Id))
                    {
                        usersWhoVoted.Add(randomUser.Id);
                        votes.Add(new Vote
                        {
                            User = randomUser,
                            Suggestion = suggestion,
                            CreatedAt = suggestion.CreatedAt.AddDays(random.Next(1, 5))
                        });
                    }
                }
            }

            await context.Votes.AddRangeAsync(votes);
            await context.SaveChangesAsync();

            var comments = new List<Comment>
            {
                new Comment { Content = "Odlična ideja, ljuljačke su stvarno dotrajale.", IsVisible = true, Suggestion = suggestions[0], Author = user2, CreatedAt = DateTime.UtcNow.AddDays(-20) },
                new Comment { Content = "Slažem se, sigurnost djece je najvažnija.", IsVisible = true, Suggestion = suggestions[0], Author = user3, CreatedAt = DateTime.UtcNow.AddDays(-19) },
                new Comment { Content = "Trebalo bi dodati i klackalice!", IsVisible = true, Suggestion = suggestions[1], Author = user5, CreatedAt = DateTime.UtcNow.AddDays(-19) },
                new Comment { Content = "Super prijedlog za tobogan!", IsVisible = true, Suggestion = suggestions[1], Author = user6, CreatedAt = DateTime.UtcNow.AddDays(-18) },
                
                new Comment { Content = "Definitivno trebaju nasloni.", IsVisible = true, Suggestion = suggestions[10], Author = user1, CreatedAt = DateTime.UtcNow.AddDays(-14) },
                new Comment { Content = "Možda neki moderniji dizajn?", IsVisible = true, Suggestion = suggestions[10], Author = user3, CreatedAt = DateTime.UtcNow.AddDays(-13) },
                new Comment { Content = "Pametne klupe su budućnost!", IsVisible = true, Suggestion = suggestions[12], Author = user7, CreatedAt = DateTime.UtcNow.AddDays(-12) },
                
                new Comment { Content = "Ovo bi stvarno poboljšalo biciklističku infrastrukturu.", IsVisible = true, Suggestion = suggestions[16], Author = user1, CreatedAt = DateTime.UtcNow.AddDays(-40) },
                new Comment { Content = "Konačno sigurna vožnja kroz centar!", IsVisible = true, Suggestion = suggestions[16], Author = user4, CreatedAt = DateTime.UtcNow.AddDays(-39) },
                new Comment { Content = "Semafori su nužni za sigurnost.", IsVisible = true, Suggestion = suggestions[18], Author = user8, CreatedAt = DateTime.UtcNow.AddDays(-35) },
                
                new Comment { Content = "Odlične lokacije za punionice.", IsVisible = true, Suggestion = suggestions[21], Author = user9, CreatedAt = DateTime.UtcNow.AddDays(-5) },
                new Comment { Content = "Trebalo bi ih biti još više.", IsVisible = true, Suggestion = suggestions[22], Author = user10, CreatedAt = DateTime.UtcNow.AddDays(-4) },
                
                new Comment { Content = "Genijalna ideja za ljeto!", IsVisible = true, Suggestion = suggestions[29], Author = user11, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                new Comment { Content = "Turisti će to voljeti.", IsVisible = true, Suggestion = suggestions[30], Author = user12, CreatedAt = DateTime.UtcNow.AddDays(-14) },
                
                new Comment { Content = "Jedva čekam obnovljeno kupalište!", IsVisible = true, Suggestion = suggestions[34], Author = user13, CreatedAt = DateTime.UtcNow.AddDays(-25) },
                new Comment { Content = "Grijanje vode je must have.", IsVisible = true, Suggestion = suggestions[35], Author = user14, CreatedAt = DateTime.UtcNow.AddDays(-24) },
            };

            await context.Comments.AddRangeAsync(comments);
            await context.SaveChangesAsync();

            var replies = new List<Comment>
            {
                new Comment { Content = "A što je s klackalicom?", IsVisible = true, Suggestion = suggestions[0], Author = user4, CreatedAt = DateTime.UtcNow.AddDays(-18), ParentComment = comments[0] },
                new Comment { Content = "I nju bi trebalo pogledati.", IsVisible = true, Suggestion = suggestions[0], Author = user5, CreatedAt = DateTime.UtcNow.AddDays(-17), ParentComment = comments[0] },
                new Comment { Content = "Slažem se!", IsVisible = true, Suggestion = suggestions[10], Author = user8, CreatedAt = DateTime.UtcNow.AddDays(-12), ParentComment = comments[5] },
                new Comment { Content = "Da, moderniji pristup bi bio super.", IsVisible = true, Suggestion = suggestions[10], Author = user9, CreatedAt = DateTime.UtcNow.AddDays(-11), ParentComment = comments[5] },
                new Comment { Content = "Možda i solarni paneli na klupi?", IsVisible = true, Suggestion = suggestions[12], Author = user10, CreatedAt = DateTime.UtcNow.AddDays(-10), ParentComment = comments[6] },
                new Comment { Content = "To bi bilo izvrsno!", IsVisible = true, Suggestion = suggestions[16], Author = user11, CreatedAt = DateTime.UtcNow.AddDays(-38), ParentComment = comments[7] },
                new Comment { Content = "Nadam se da će brzo realizirati.", IsVisible = true, Suggestion = suggestions[21], Author = user12, CreatedAt = DateTime.UtcNow.AddDays(-3), ParentComment = comments[10] },
                new Comment { Content = "Svakako, cijeli grad treba pokriti.", IsVisible = true, Suggestion = suggestions[22], Author = user13, CreatedAt = DateTime.UtcNow.AddDays(-2), ParentComment = comments[11] },
            };

            await context.Comments.AddRangeAsync(replies);
            await context.SaveChangesAsync();

            var notices = new List<Notice>
            {
                new Notice { Title = "Produljen rok za prijedloge - Igralište Maksimir", Content = "Rok za predaju prijedloga za natječaj 'Obnova dječjeg igrališta Maksimir' produljen je do kraja idućeg tjedna.", Proposal = proposals[0], Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                new Notice { Title = "Status prijava za čitanje priča", Content = "Zaprimili smo velik broj prijava volontera. Hvala svima! Uskoro ćemo objaviti raspored.", Proposal = proposals[1], Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                new Notice { Title = "Podsjetnik: Glasanje u tijeku", Content = "Glasanje za prijedloge za natječaj 'Obnova dječjeg igrališta Maksimir' je otvoreno!", Proposal = proposals[0], Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-5) },
                new Notice { Title = "Radovi na Jarunu počinju uskoro", Content = "Obavještavamo građane da radovi na biciklističkim stazama počinju sljedeći mjesec.", Proposal = proposals[2], Moderator = modZg, CreatedAt = DateTime.UtcNow.AddDays(-1) },
                
                new Notice { Title = "Rezultati glasanja - Klupe na Rivi", Content = "Prijedlog za pametne klupe osvojio je najviše glasova!", Proposal = proposals[4], Moderator = modSt, CreatedAt = DateTime.UtcNow.AddDays(-3) },
                new Notice { Title = "Početak radova na Bačvicama", Content = "Radovi na postavljanju novih tuševa počinju sljedeći tjedan.", Proposal = proposals[5], Moderator = modSt, CreatedAt = DateTime.UtcNow.AddDays(-1) },
                
                new Notice { Title = "Javna rasprava o biciklističkoj stazi", Content = "Pozivamo sve građane na javnu raspravu o planiranoj biciklističkoj stazi koja će se održati u petak.", Proposal = proposals[7], Moderator = modRi, CreatedAt = DateTime.UtcNow.AddDays(-10) },
                
                new Notice { Title = "Završeno ozelenjavanje Tvrđe", Content = "S ponosom objavljujemo da je projekt ozelenjavanja uspješno završen!", Proposal = proposals[9], Moderator = modOs, CreatedAt = DateTime.UtcNow.AddDays(-7) },
                new Notice { Title = "Nova trim staza - traže se prijedlozi", Content = "Još uvijek primamo prijedloge za lokacije trim sprava.", Proposal = proposals[10], Moderator = modOs, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                
                new Notice { Title = "Odobreno postavljanje punionica", Content = "Gradsko vijeće odobrilo je postavljanje punionica na predloženim lokacijama.", Proposal = proposals[11], Moderator = modZd, CreatedAt = DateTime.UtcNow.AddDays(-1) },
                
                new Notice { Title = "Testiranje WiFi mreže", Content = "Sljedeći tjedan počinje testno razdoblje besplatne WiFi mreže oko Arene.", Proposal = proposals[14], Moderator = modPu, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                
                new Notice { Title = "Novi reciklažni otoci postavljeni", Content = "Postavljeno je 5 novih reciklažnih otoka. Molimo građane da ih koriste odgovorno.", Proposal = proposals[15], Moderator = modVz, CreatedAt = DateTime.UtcNow.AddDays(-5) },
                
                new Notice { Title = "Pilot projekt hlađenja", Content = "Započinjemo s pilot projektom postavljanja raspršivača na manjem dijelu Straduna.", Proposal = proposals[17], Moderator = modDu, CreatedAt = DateTime.UtcNow.AddDays(-3) },
                
                new Notice { Title = "Odabrane biljke za park", Content = "Na temelju vaših prijedloga, odabrali smo mediteranske biljke za novi park.", Proposal = proposals[18], Moderator = modSi, CreatedAt = DateTime.UtcNow.AddDays(-4) },
                
                new Notice { Title = "Foginovo kupalište - faza planiranja", Content = "Trenutno smo u fazi detaljnog planiranja renovacije. Hvala na strpljenju!", Proposal = proposals[19], Moderator = modKa, CreatedAt = DateTime.UtcNow.AddDays(-6) }
            };

            await context.Notices.AddRangeAsync(notices);
            await context.SaveChangesAsync();
        }
    }
}