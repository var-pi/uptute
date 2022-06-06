package com.uptute.backend;

// import com.uptute.backend.domain.AccauntDetails;
// import com.uptute.backend.domain.TutorDetails;
// import com.uptute.backend.domain.UserDetails;
// import com.uptute.backend.entities.Accaunt;
import com.uptute.backend.entities.Role;
import com.uptute.backend.enums.ERole;
import com.uptute.backend.repositories.UserRepository;
import com.uptute.backend.repositories.RoleRepository;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class BackendApplication {
	// private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	public CommandLineRunner demo(UserRepository accauntRepository, RoleRepository roleRepository) {
		return (args) -> {
			if (roleRepository.count() == 0)
				for (var role : ERole.values())
					roleRepository.save(new Role(role));

			// if (accauntRepository.count() == 0) {
			// 	accauntRepository.save(new Accaunt(new AccauntDetails("Carcaryn", "Battleheart"), new UserDetails(),
			// 			new TutorDetails()));
			// 	accauntRepository.save(new Accaunt(new AccauntDetails("Caikahn", "Mongothsbeard"), new UserDetails(),
			// 			new TutorDetails()));
			// 	accauntRepository.save(new Accaunt(new AccauntDetails("Therlynn", "Wyvernjack"), new UserDetails(),
			// 			new TutorDetails()));
			// 	accauntRepository.save(new Accaunt(new AccauntDetails("Thotumal", "Glimmergaunt"), new UserDetails(),
			// 			new TutorDetails()));
			// 	accauntRepository.save(new Accaunt(new AccauntDetails("Eilonna", "Greensleeves"), new UserDetails(),
			// 			new TutorDetails()));
			// }
			// log.info("Customers found with findAll():");
			// log.info("-------------------------------");
			// for (Accaunt accaunt : accauntRepository.findAll())
			// 	log.info(accaunt.getAccauntDetails().toString());
			// log.info("-------------------------------");
		};
	}
}