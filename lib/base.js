(function (window) {

	'use strict';

	class Dictionary {

		static date() {
			return 'data/ora';
		}
		static mode() {
			return 'modalità';
		}
		static energy() {
			return 'energia consumata';
		}
		static saving() {
			return 'area saving';
		}
		static bypass() {
			return 'area bypass';
		}
	}

	class Area {

		static saving() {
			return 'area di commutazione saving/bypass';
		}
		static bypass() {
			return 'area di commutazione bypass/saving';
		}
	}

	class Delta {

		static energy() {
			return 'ΔE [kWh]';
		}
		static time() {
			return 'Δt [s]';
		}
	}

	class Um {

		static power() {
			return 'kWh';
		}
	}

	class Report {
		static saving() {
			return 'consumo complessivo [kWh] in modalità saving';
		}
		static saving_time() {
			return 'tempo complessivo [s] in modalità saving';
		}
		static saving_transaction() {
			return 'consumo complessivo [kWh] nella fase di commutazione saving/bypass';
		}
		static saving_transaction_time() {
			return 'tempo complessivo [s] nella fase di commutazione saving/bypass';
		}
		static bypass() {
			return 'consumo complessivo [kWh] in modalità bypass';
		}
		static bypass_time() {
			return 'tempo complessivo [s] in modalità bypass';
		}
		static bypass_transaction() {
			return 'consumo complessivo [kWh] nella fase di commutazione bypass/saving';
		}
		static bypass_transaction_time() {
			return 'tempo complessivo [s] nella fase di commutazione bypass/saving';
		}
	}

	class Line {

		static saving() {
			return 0;
		}
		static bypass() {
			return 1;
		}

		constructor(energy, utilization) {
			this.energy = energy;
			this.utilization = utilization;
			this.elements = {};
			this.getTop();
			this.getBottom();
			this.getUnderline();
		}

		getEnergy() {
			return this.energy;
		}
		getUtilization() {
			return this.utilization;
		}
		getTop() {
			if (this.elements.hasOwnProperty('top')) return this.elements.top;
			let raw = this.getEnergy().getRaw(),
				utilization = this.getUtilization(),
				color = utilization === this.constructor.saving() ? 'green' : 'red',
				last = raw.report_switcher_saving_power.length - 1,
				timer = utilization === this.constructor.saving()
					? raw.report_switcher_saving_power[last][0] - window.IMQ.Energy.backtime()
					: raw.report_switcher_bypass_power[0][0];

			let energy = utilization === this.constructor.saving() ? raw.report_switcher_saving : raw.report_switcher_bypass - raw.report_switcher_bypass_area,
				energy_saving = utilization === this.constructor.saving() ? raw.report_switcher_saving_area.toFixed(2).toString() : null,
				energy_bypass_time = utilization === this.constructor.bypass() ? window.IMQ.Energy.backtime().toString() : null,
				energy_fields_bitch = utilization === this.constructor.saving() ? window.IMQ.Energy.backtime() : raw.report_switcher_bypass_area.toFixed(2);

			let title = utilization === this.constructor.bypass() ? window.IMQ.Dictionary.bypass() : window.IMQ.Dictionary.saving();
			this.elements.top = this.getEnergy().getIMQ().getTable().getTbody().addRow(
				window.Table.Tr.Td.content(null),
				window.Table.Tr.Td.content(window.moment.unix(timer).utc().format(window.IMQ.Energy.format())),
				window.Table.Tr.Td.content(title),
				window.Table.Tr.Td.content(energy.toFixed(2).toString()),
				window.Table.Tr.Td.content(energy_saving),
				window.Table.Tr.Td.content(energy_fields_bitch.toString()),
				window.Table.Tr.Td.content(energy_bypass_time),
				window.Table.Tr.Td.content(null),
				window.Table.Tr.Td.content(null)
			);

			this.elements.top.getColumn(0).setRowspan(2).setClass('before');
			this.elements.top.getColumn(2).setRowspan(2);
			this.elements.top.getColumn(4).setRowspan(2);
			this.elements.top.getColumn(5).setRowspan(2);
			this.elements.top.getColumn(6).setRowspan(2);
			if (utilization === this.constructor.bypass())
				this.elements.top.getColumn(4).setColspan(2);

			for (let item = 6; item < 9; item++) {
				if (utilization === this.constructor.bypass()
					&& item === 6) continue;

				this.elements.top.getColumn(item).setColspan(2).setRowspan(2);
			}

			this.elements.top.setClass(color);
			return this.elements.top;
		}
		getBottom() {
			if (this.elements.hasOwnProperty('bottom')) return this.elements.bottom;
			let raw = this.getEnergy().getRaw(),
				last = raw.report_switcher_saving_power.length - 1,
				utilization = this.getUtilization(),
				color = utilization === this.constructor.saving() ? 'green' : 'red',
				timer = utilization === this.constructor.saving()
					? raw.report_switcher_saving_power[last][0]
					: raw.report_switcher_bypass_power[0][0] + window.IMQ.Energy.backtime();

			let energy = utilization === this.constructor.saving() ? raw.report_switcher_saving + raw.report_switcher_saving_area : raw.report_switcher_bypass;
			this.elements.bottom = this.getEnergy().getIMQ().getTable().getTbody().addRow(
				window.Table.Tr.Td.content(window.moment.unix(timer).utc().format(window.IMQ.Energy.format())),
				window.Table.Tr.Td.content(energy.toFixed(2).toString())
			);

			this.elements.bottom.setClass(color);
			return this.elements.bottom;
		}
		getUnderline() {
			if (this.elements.hasOwnProperty('underline')) return this.elements.underline;
			let raw = this.getEnergy().getRaw(),
				last = raw.report_switcher_saving_power.length - 1,
				utilization = this.getUtilization(),
				energy_saving = utilization === this.constructor.saving() ? raw.report_switcher_saving_area_transaction.toFixed(2).toString() : null,
				energy_bypass_time = utilization === this.constructor.bypass() ? raw.report_switcher_bypass_area_transaction_time : null,
				energy_fields_bitch = utilization === this.constructor.saving()
					? raw.report_switcher_bypass_power[0][0] - raw.report_switcher_saving_power[last][0]
					: raw.report_switcher_bypass_area_transaction.toFixed(2);

			this.elements.underline = this.getEnergy().getIMQ().getTable().getTbody().addRow(
				window.Table.Tr.Td.content(null),
				window.Table.Tr.Td.content(null),
				window.Table.Tr.Td.content(energy_saving),
				window.Table.Tr.Td.content(energy_fields_bitch),
				window.Table.Tr.Td.content(energy_bypass_time)
			);

			let item = utilization === this.constructor.saving() ? 4 : 2,
				color = utilization === this.constructor.saving() ? 'orange' : 'blue';
			this.elements.underline.getColumn(0).setColspan(4);
			this.elements.underline.getColumn(1).setColspan(4);
			this.elements.underline.getColumn(item).setColspan(2);
			this.elements.underline.setClass(color);

			return this.elements.underline;
		}
	}

	class Energy {

		static format() {
			return 'DD/MM/YYYY HH:mm:ss';
		}
		static backtime() {
			return 280;
		}

		constructor(imq, raw) {
			this.imq = imq;
			this.raw = raw;
			this.elements = {};
			this.getSaving();
			this.getBypass();
		}

		getIMQ() {
			return this.imq;
		}
		getRaw() {
			return this.raw;
		}
		getSaving() {
			if (this.elements.hasOwnProperty('saving')) return this.elements.saving;
			this.elements.saving = new window.IMQ.Energy.Line(this, window.IMQ.Energy.Line.saving());
			return this.elements.saving;
		}
		getBypass() {
			if (this.elements.hasOwnProperty('bypass')) return this.elements.bypass;
			this.elements.bypass = new window.IMQ.Energy.Line(this, window.IMQ.Energy.Line.bypass());
			return this.elements.bypass;
		}
	}

	class IMQ {

		constructor() {
			this.elements = {};
			this.elements.total = new window.IMQ.Energy.Total(this);
			this.elements.table = new Table();
			this.elements.switching = [];

			this.getHeader();
			this.getUnit();
		}

		getTable() {
			return this.elements.table;
		}
		getTotal() {
			return this.elements.total;
		}
		getSwitching() {
			return this.elements.switching;
		}
		getContent() {
			if (this.elements.hasOwnProperty('content')) return this.elements.content;
			let table = this.getTable().out(),
				total = this.getTotal().out(),
				section = document.createElement('section');

			table.className = 'grid';
			total.className = 'grid total response';

			this.elements.content = document.createElement('div');
			this.elements.content.className = 'imq';

			section.appendChild(total);
			this.elements.content.appendChild(table);
			this.elements.content.appendChild(section);
			return this.elements.content;
		}
		getHeader() {
			if (this.elements.hasOwnProperty('header')) return this.elements.header;
			this.elements.header = this.getTable().getThead().addRow(
				window.Table.Tr.Th.content(window.IMQ.Dictionary.date()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.mode()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.energy()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.saving()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.bypass()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Area.saving()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Area.bypass())
			);
			this.elements.header.getColumn(0).setColspan(2);
			for (let item = 3; item < 7; item++)
				this.elements.header.getColumn(item).setColspan(2).setClass('area');

			return this.elements.header;
		}
		getUnit() {
			if (this.elements.hasOwnProperty('unit')) return this.elements.unit;
			this.elements.unit = this.getTable().getThead().addRow(
				window.Table.Tr.Th.content(null),
				window.Table.Tr.Th.content(null),
				window.Table.Tr.Th.content(String.fromCharCode(91) + window.IMQ.Dictionary.Um.power() + String.fromCharCode(93)),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.energy()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.time()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.energy()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.time()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.energy()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.time()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.energy()),
				window.Table.Tr.Th.content(window.IMQ.Dictionary.Delta.time())
			);
			this.elements.unit.setClass('unit');
			this.elements.unit.getColumn(0).setColspan(2);
			for (let item = 3; item < 10; item++)
				this.elements.unit.getColumn(item).setClass('area');

			return this.elements.unit;
		}
		addSwitch(object) {
			let line = new window.IMQ.Energy(this, object);
			this.getSwitching().push(line);
			return line;
		}
		out() {
			return this.getContent();
		}
	}

	class Total {

		static template() {
			return {
				saving: 0,
				saving_time: 40320,
				saving_transaction: 0,
				saving_transaction_time: 0,
				bypass: 0,
				bypass_time: 40320,
				bypass_transaction: 0,
				bypass_transaction_time: 0
			};
		}

		constructor(imq) {
			this.imq = imq;
			this.elements = {};
			this.elements.table = new Table();
			this.response = this.constructor.template();
		}

		getTable() {
			return this.elements.table;
		}
		getIMQ() {
			return this.imq;
		}
		getResponse() {
			return this.response;
		}
		generate() {
			let switching = this.getIMQ().getSwitching(),
				response = this.getResponse();

			for (let item = 0; item < switching.length; item++) {
				let raw = switching[item].getRaw(),
					last = raw.report_switcher_saving_power.length - 1;

				response.saving += raw.report_switcher_saving_area;
				response.saving_transaction += raw.report_switcher_saving_area_transaction;
				response.saving_transaction_time += raw.report_switcher_bypass_power[0][0] - raw.report_switcher_saving_power[last][0];
				response.bypass += raw.report_switcher_bypass_area;
				response.bypass_transaction += raw.report_switcher_bypass_area_transaction;
				response.bypass_transaction_time += raw.report_switcher_bypass_area_transaction_time;
			}

			let i = 0;
			for (let item in response) {
				let round = i++ % 2 === 0 ? 2 : 0,
					tbody = this.getTable().getTbody(),
					parameters = [
						window.Table.Tr.Td.content(window.IMQ.Energy.Total.Report[item]()),
						window.Table.Tr.Td.content(response[item].toFixed(round))
					];

				let line = tbody.addRow.apply(tbody, parameters),
					rows = tbody.getRows();

				line.getColumn(1).setClass('value');

				if (rows.length === 0) return this;

				let colspan = 1 + rows.length;
				line.getColumn(0).setColspan(colspan);
			}
			return this;
		}
		out() {
			return this.getTable().out();
		}
	}

	window.IMQ = IMQ;
	window.IMQ.Energy = Energy;
	window.IMQ.Energy.Line = Line;
	window.IMQ.Energy.Total = Total;
	window.IMQ.Energy.Total.Report = Report;
	window.IMQ.Dictionary = Dictionary;
	window.IMQ.Dictionary.Area = Area;
	window.IMQ.Dictionary.Delta = Delta;
	window.IMQ.Dictionary.Um = Um;

})(window);
