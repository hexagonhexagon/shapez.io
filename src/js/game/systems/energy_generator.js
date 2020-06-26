import { DrawParameters } from "../../core/draw_parameters";
import { T } from "../../translations";
import { EnergyGeneratorComponent } from "../components/energy_generator";
import { Entity } from "../entity";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { ShapeDefinition } from "../shape_definition";

export class EnergyGeneratorSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [EnergyGeneratorComponent]);
    }

    draw(parameters) {
        this.forEachMatchingEntityOnScreen(parameters, this.drawEntity.bind(this));
    }

    /**
     * Returns which shape is required for a given generator
     * @param {Entity} entity
     */
    getShapeRequiredForGenerator(entity) {
        return "CuCuCuCu";
    }

    update() {
        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];
            const energyGenComp = entity.components.EnergyGenerator;

            if (!energyGenComp.requiredKey) {
                // Compute required key for this generator
                energyGenComp.requiredKey = this.getShapeRequiredForGenerator(entity);
            }
        }
    }

    /**
     * @param {DrawParameters} parameters
     * @param {Entity} entity
     */
    drawEntity(parameters, entity) {
        const context = parameters.context;
        const staticComp = entity.components.StaticMapEntity;

        if (!staticComp.shouldBeDrawn(parameters)) {
            return;
        }

        const energyGenComp = entity.components.EnergyGenerator;
        if (!energyGenComp.requiredKey) {
            // Not initialized yet
            return;
        }

        const pos = staticComp.getTileSpaceBounds().getCenter().toWorldSpace();

        // TESTING
        const definition = ShapeDefinition.fromShortKey(energyGenComp.requiredKey);
        definition.draw(pos.x, pos.y, parameters, 30);

        const energyGenerated = 5;

        // deliver: Deliver
        // toGenerateEnergy: For <x> energy
        context.font = "bold 7px GameFont";
        context.fillStyle = "#64666e";
        context.textAlign = "left";
        context.fillText(T.buildings.energy_generator.deliver.toUpperCase(), pos.x - 25, pos.y - 18);

        context.fillText(
            T.buildings.energy_generator.toGenerateEnergy.replace("<x>", "" + energyGenerated).toUpperCase(),
            pos.x - 25,
            pos.y + 28
        );
    }
}
