import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<nav class="navbar navbar-expand-md navbar-dark fixed-top" style="background-color: #092768 !important;">
					<a class="navbar-brand" href="#">#cleanfood</a>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#theNavbar" aria-controls="theNavbar" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="theNavbar">
						<ul class="navbar-nav mr-auto">
							<li class="nav-item active">
								<Link class="nav-link" href="/">Home <span class="sr-only">(current)</span></Link>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="https://github.com/css-ch/zhack17" target="_blank"><i class="fa fa-github"></i> GitHub</a>
							</li>
						</ul>
					</div>
				</nav>
			</header>
		);
	}
}
