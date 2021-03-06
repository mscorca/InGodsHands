/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

pc.script.create('globalInterface', function (context) {
    // Creates a new GlobalVariables instance
    var GlobalVariables = function (entity) {
        this.entity = entity;
        //time = 0;
    };

    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
			this.envRespawnTime = 0.5;
			this.envRespawnTimer = 0;
			
            globalTemperature = 90;
            globalTemperatureMax = 100;

            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");
            globalSunRotation = 50;

            maxTotalBelief = 100;
            totalBelief = maxTotalBelief;
            prevTotalBelief = totalBelief;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			//'Update' tiles (should probably be in the tile class instead but they aren't a proper pc object...)
			for (var i = 0; i < ico.tiles.length; i++) {
				var tile = ico.tiles[i];
				
				if (tile.isRaining) {
					tile.rainTimer -= dt;
					if (tile.rainTimer <= 0) tile.stopRain();
				}
				
				if (tile.isFoggy) {
					tile.fogTimer -= dt;
					if (tile.fogTimer <= 0) tile.stopFog();
				}
			}
			
			//Start rain/fog randomly (temporary)
			this.envRespawnTimer -= dt;
			if (this.envRespawnTimer <= 0) {
				this.envRespawnTimer += this.envRespawnTime;
				
				for (var i = 0; i < ico.tiles.length; i++) {
					if (Math.random() < 0.002) ico.tiles[i].startFog();
					if (Math.random() < 0.0015) ico.tiles[i].startRain();
				}
			}
			
			
            // Test temperature
            // time += dt;
            // var t = (time % 10);
            // globalTemperature = t*10;
            // End test temperature

            // Test belief
            if ((prevTotalBelief > totalBelief && totalBelief > 0) || totalBelief > maxTotalBelief) {
                prevTotalBelief = totalBelief;
                totalBelief -= dt* 10;
            } else {
                prevTotalBelief = totalBelief;
                totalBelief += dt* 10;
            }


            sun.setPosition(0, 0, 0);

            /**** Test sun rotation ****/
            //sun.rotate(0, dt * 100, 0);
            sun.rotate(0, dt * globalSunRotation, 0);
            //sun.rotateLocal(0, dt * 100, 0);
            shaderSun.rotateLocal(0, dt * globalSunRotation * -2, 0);
            //sun.setEulerAngles(0, 90 + this.time, 0);
            /****                   ****/
        }
    };

    return GlobalVariables;
});