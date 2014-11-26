module.exports = function(translator){
	
	var t = function(str, lang, vars){
		return translator.translate(str, lang, vars);
	}
	
	var CategoryManager = {
	
		categories: {
			appartment: ['appartment', 'flat', 'studio', 'loft', 'duplex', 'triplex', 'penthouse', 'ground-floor', 'kot'],
			house: ['house', 'bel-etage', 'mansion', 'villa', 'cottage', 'farmhouse', 'castle', 'bungalow', 'chalet', 'building'],
			business: ['office', 'office-building', 'commercial-premise', 'commercial-ground-floor', 'hotel', 'restaurant', 'cafe', 'warehouse', 'industral-building'],
			garage: ['indoor-parking', 'outdoor-parking', 'lock-up-garage'],
			terrain: ['land', 'building-land', 'field', 'meadow', 'orchard', 'unbuildable-land']
		},
	
		types: {
			fr: {
				appartment: t("Appartement", 'fr'),
				studio: t("Studio", 'fr'),
				flat: t("Flat", 'fr'),
				loft: t("Loft", 'fr'),
				duplex: t("Duplex", 'fr'),
				triplex: t("Triplex", 'fr'),
				penthouse: t("Penthouse", 'fr'),
				kot: t("Kot", 'fr'),
				'ground-floor': t("Rez-de-chaussée", 'fr'),
				house: t("Maison", 'fr'),
				'bel-etage': t("Bel étage", 'fr'),
				mansion: t("Maison de maître", 'fr'),
				villa: t("Villa", 'fr'),
				cottage: t("Fermette", 'fr'),
				farmhouse: t("Ferme", 'fr'),
				bungalow: t("Bungalow", 'fr'),
				building: t("Immeuble", 'fr'),
				castle: t("Château", 'fr'),
				chalet: t("Châlet", 'fr'),
				office: t("Bureau", 'fr'),
				'office-building': t("Immeuble de bureaux", 'fr'),
				'commercial-premise': t("Bien commercial", 'fr'),
				'commercial-ground-floor': t("Rez-de-chaussée commercial", 'fr'),
				hotel: t("Hôtel", 'fr'),
				restaurant: t("Restaurant", 'fr'),
				cafe: t("Café", 'fr'),
				warehouse: t("Entrepôt", 'fr'),
				'industrial-building': t("Bâtiment industriel", 'fr'),
				'indoor-parking': t("Emplacement de parking intérieur", 'fr'),
				'outdoor-parking': t("Emplacement de parking extérieur", 'fr'),
				'lock-up-garage': t("Box fermé", 'fr'),
				'land': t("Terrain", 'fr'),
				'building-land': t("Terrain à bâtir", 'fr'),
				'field': t("Champ", 'fr'),
				meadow: t("Prairie", 'fr'),
				orchard: t("Verger", 'fr'),
				'unbuildable-land': t("Terrain non-bâtissable", 'fr')
				
			},
			nl: {
				appartment: t("Appartement", 'nl'),
				studio: t("Studio", 'nl'),
				flat: t("Flat", 'nl'),
				loft: t("Loft", 'nl'),
				duplex: t("Duplex", 'nl'),
				triplex: t("Triplex", 'nl'),
				penthouse: t("Penthouse", 'nl'),
				kot: t("Kot", 'nl'),
				'ground-floor': t("Rez-de-chaussée", 'nl'),
				house: t("Maison", 'nl'),
				'bel-etage': t("Bel étage", 'nl'),
				mansion: t("Maison de maître", 'nl'),
				villa: t("Villa", 'nl'),
				cottage: t("Fermette", 'nl'),
				farmhouse: t("Ferme", 'nl'),
				bungalow: t("Bungalow", 'nl'),
				building: t("Immeuble", 'nl'),
				castle: t("Château", 'nl'),
				chalet: t("Châlet", 'nl'),
				office: t("Bureau", 'nl'),
				'office-building': t("Immeuble de bureaux", 'nl'),
				'commercial-premise': t("Bien commercial", 'nl'),
				'commercial-ground-floor': t("Rez-de-chaussée commercial", 'nl'),
				hotel: t("Hôtel", 'nl'),
				restaurant: t("Restaurant", 'nl'),
				cafe: t("Café", 'nl'),
				warehouse: t("Entrepôt", 'nl'),
				'industrial-building': t("Bâtiment industriel", 'nl'),
				'indoor-parking': t("Emplacement de parking intérieur", 'nl'),
				'outdoor-parking': t("Emplacement de parking extérieur", 'nl'),
				'lock-up-garage': t("Box fermé", 'nl'),
				'land': t("Terrain", 'nl'),
				'building-land': t("Terrain à bâtir", 'nl'),
				'field': t("Champ", 'nl'),
				meadow: t("Prairie", 'nl'),
				orchard: t("Verger", 'nl'),
				'unbuildable-land': t("Terrain non-bâtissable", 'nl')
			},
			en: {
				appartment: t("Appartement", 'en'),
				studio: t("Studio", 'en'),
				flat: t("Flat", 'en'),
				loft: t("Loft", 'en'),
				duplex: t("Duplex", 'en'),
				triplex: t("Triplex", 'en'),
				penthouse: t("Penthouse", 'en'),
				kot: t("Kot", 'en'),
				'ground-floor': t("Rez-de-chaussée", 'en'),
				house: t("Maison", 'en'),
				'bel-etage': t("Bel étage", 'en'),
				mansion: t("Maison de maître", 'en'),
				villa: t("Villa", 'en'),
				cottage: t("Fermette", 'en'),
				farmhouse: t("Ferme", 'en'),
				bungalow: t("Bungalow", 'en'),
				building: t("Immeuble", 'en'),
				castle: t("Château", 'en'),
				chalet: t("Châlet", 'en'),
				office: t("Bureau", 'en'),
				'office-building': t("Immeuble de bureaux", 'en'),
				'commercial-premise': t("Bien commercial", 'en'),
				'commercial-ground-floor': t("Rez-de-chaussée commercial", 'en'),
				hotel: t("Hôtel", 'en'),
				restaurant: t("Restaurant", 'en'),
				cafe: t("Café", 'en'),
				warehouse: t("Entrepôt", 'en'),
				'industrial-building': t("Bâtiment industriel", 'en'),
				'indoor-parking': t("Emplacement de parking intérieur", 'en'),
				'outdoor-parking': t("Emplacement de parking extérieur", 'en'),
				'lock-up-garage': t("Box fermé", 'en'),
				'land': t("Terrain", 'en'),
				'building-land': t("Terrain à bâtir", 'en'),
				'field': t("Champ", 'en'),
				meadow: t("Prairie", 'en'),
				orchard: t("Verger", 'en'),
				'unbuildable-land': t("Terrain non-bâtissable", 'en')
			}
		}
	}
	
	
	return CategoryManager
}




